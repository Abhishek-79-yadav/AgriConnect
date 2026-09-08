package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.CheckoutRequest;
import com.example.AgriConnect.dto.response.CouponResponse;
import com.example.AgriConnect.dto.response.OrderResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;
    private final CouponService couponService;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final RefundService refundService;

    @Transactional
    public OrderResponse checkout(String email, CheckoutRequest request) {

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        List<Cart> cartItems = cartRepository.findByBuyerId(buyer.getId());

        if (cartItems.isEmpty()) {
            throw new ApiException("Cart is empty");
        }

        // Buyer can checkout a subset of their cart (the cart page's
        // "select items" option) instead of always the whole thing.
        if (request.getCartItemIds() != null && !request.getCartItemIds().isEmpty()) {
            java.util.Set<Long> requested = new java.util.HashSet<>(request.getCartItemIds());
            List<Cart> selected = cartItems.stream()
                    .filter(c -> requested.contains(c.getId()))
                    .toList();

            if (selected.size() != requested.size()) {
                throw new ApiException("Some selected cart items no longer exist");
            }
            cartItems = selected;
        }

        boolean isCod = "COD".equalsIgnoreCase(request.getPaymentMethod());

        Order order = Order.builder()
                .buyer(buyer)
                // COD orders don't go through Razorpay, so there's nothing
                // left to "pay" online — mark them confirmed right away.
                // ONLINE orders stay PENDING until verifyPayment() confirms them.
                .status(isCod ? OrderStatus.CONFIRMED : OrderStatus.PENDING)
                .paid(false)
                .paymentMethod(isCod ? "COD" : "ONLINE")
                .deliveryName(request.getDeliveryName())
                .deliveryPhone(request.getDeliveryPhone())
                .deliveryAddressLine(request.getDeliveryAddressLine())
                .deliveryCity(request.getDeliveryCity())
                .deliveryState(request.getDeliveryState())
                .deliveryPincode(request.getDeliveryPincode())
                .items(new ArrayList<>())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (Cart c : cartItems) {

            Product p = c.getProduct();

            if (p.getQuantity() < c.getQuantity()) {
                throw new ApiException("Out of stock: " + p.getProductName());
            }

            p.setQuantity(p.getQuantity() - c.getQuantity());

            BigDecimal itemTotal = p.getPrice()
                    .multiply(BigDecimal.valueOf(c.getQuantity()));

            total = total.add(itemTotal);

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(p)
                    .quantity(c.getQuantity())
                    .price(itemTotal.doubleValue())
                    .build();

            order.getItems().add(item);
        }

        double finalTotal = total.doubleValue();

        // Coupon is optional — validated and applied here (not just
        // computed and thrown away like the standalone /api/coupon/apply
        // endpoint) so the discount actually affects what gets charged and
        // is recorded on the order.
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            CouponResponse couponResult = couponService.applyCoupon(request.getCouponCode(), finalTotal);
            order.setCouponCode(request.getCouponCode());
            order.setDiscount(couponResult.getDiscount());
            finalTotal = couponResult.getFinalAmount();
        }

        order.setTotalPrice(finalTotal);

        Order saved = orderRepository.save(order);

        // Seed the delivery timeline with the order's starting status.
        recordStatusHistory(saved, saved.getStatus(),
                isCod ? "Order confirmed (Cash on Delivery)" : "Order placed, awaiting payment");

        // Stock was already deducted above the moment this order was
        // created — the selected cart rows are equally spent now, whether
        // the order ends up COD (confirmed immediately) or ONLINE (still
        // awaiting payment). Deleting them here — rather than waiting for
        // payment confirmation — also means partial cart selection only
        // clears the items actually checked out, not the whole cart.
        cartRepository.deleteAllById(cartItems.stream().map(Cart::getId).toList());

        // Notify every farmer whose product is in this order — dedupe so a
        // farmer with 3 items in one order gets one notification, not 3.
        saved.getItems().stream()
                .map(item -> item.getProduct().getFarmer())
                .distinct()
                .forEach(farmer -> notificationService.createNotification(
                        farmer,
                        "You have a new order (#" + saved.getId() + ") — check your Orders page."
                ));

        // Mapped to a DTO *inside* the transaction, while the Hibernate
        // session is still open — returning the raw entity risked lazy
        // fields blowing up during JSON serialization after the session
        // had already closed (which surfaced as a 500 even though the
        // order had actually been created and the cart already cleared).
        return mapToResponse(saved);
    }

    // BUYER ORDERS
    public List<OrderResponse> getBuyerOrders(String email) {
        User buyer = getUser(email);
        return orderRepository.findByBuyer_Id(buyer.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // FARMER ORDERS
    public List<OrderResponse> getFarmerOrders(String email) {
        User farmer = getUser(email);
        return orderRepository.findFarmerOrders(farmer.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ADMIN: ALL ORDERS
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // FARMER (or ADMIN) UPDATES ORDER STATUS — BUYER MAY ONLY CANCEL
    @Transactional
    public OrderResponse updateStatus(Long orderId, String statusValue, String email) {

        User user = getUser(email);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        boolean isAdmin = user.getRole() == Role.ADMIN;

        boolean ownsAnItem = order.getItems().stream()
                .anyMatch(item -> item.getProduct().getFarmer().getId().equals(user.getId()));

        boolean isBuyer = order.getBuyer().getId().equals(user.getId());

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(statusValue.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid status: " + statusValue);
        }

        // The buyer can only ever cancel their own order (never move it
        // forward through the fulfillment stages — that's the farmer's
        // job), and only while it hasn't shipped yet.
        if (isBuyer && !isAdmin && !ownsAnItem) {
            if (newStatus != OrderStatus.CANCELLED) {
                throw new ApiException("You can only cancel your own order");
            }
            if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
                throw new ApiException("This order has already shipped and can no longer be cancelled");
            }
        } else if (!isAdmin && !ownsAnItem) {
            throw new ApiException("You can only update orders containing your own products");
        }

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new ApiException("This order is already " + order.getStatus() + " and can't be changed");
        }

        // checkout() deducted stock the moment the order was created —
        // give it back on cancellation so it isn't lost forever.
        if (newStatus == OrderStatus.CANCELLED) {
            order.getItems().forEach(item -> {
                Product p = item.getProduct();
                p.setQuantity(p.getQuantity() + item.getQuantity());
                productRepository.save(p);
            });

            // Money already changed hands for a paid order — credit it
            // back to the buyer's wallet rather than just voiding the order.
            if (order.isPaid()) {
                refundService.initiateRefund(order, null, order.getTotalPrice(),
                        "Order #" + order.getId() + " cancelled");
            }
        }

        // COD orders start unpaid (checkout() sets paid=false since nothing
        // has actually changed hands yet). Cash is collected at the moment
        // of delivery, so that's when it should start counting toward
        // revenue/collection totals — otherwise a delivered COD order would
        // never show up as "collected" even though the farmer has been paid.
        if (newStatus == OrderStatus.DELIVERED && "COD".equalsIgnoreCase(order.getPaymentMethod())) {
            order.setPaid(true);
        }

        if (newStatus == OrderStatus.DELIVERED) {
            order.setDeliveredAt(java.time.LocalDateTime.now());
        }

        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);

        recordStatusHistory(saved, newStatus, null);

        return mapToResponse(saved);
    }

    // FARMER (or ADMIN) ATTACHES/UPDATES CARRIER + TRACKING INFO
    @Transactional
    public OrderResponse updateShipment(Long orderId, com.example.AgriConnect.dto.request.ShipmentUpdateRequest request, String email) {

        User user = getUser(email);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        boolean isAdmin = user.getRole() == Role.ADMIN;

        boolean ownsAnItem = order.getItems().stream()
                .anyMatch(item -> item.getProduct().getFarmer().getId().equals(user.getId()));

        if (!isAdmin && !ownsAnItem) {
            throw new ApiException("You can only update tracking for orders containing your own products");
        }

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new ApiException("This order is already " + order.getStatus() + " and tracking can't be changed");
        }

        if (request.getCarrier() != null) order.setCarrier(request.getCarrier());
        if (request.getTrackingNumber() != null) order.setTrackingNumber(request.getTrackingNumber());
        if (request.getTrackingUrl() != null) order.setTrackingUrl(request.getTrackingUrl());
        if (request.getExpectedDeliveryDate() != null) order.setExpectedDeliveryDate(request.getExpectedDeliveryDate());

        Order saved = orderRepository.save(order);

        recordStatusHistory(saved, saved.getStatus(),
                "Tracking updated" + (saved.getCarrier() != null ? " — " + saved.getCarrier() : "")
                        + (saved.getTrackingNumber() != null ? " #" + saved.getTrackingNumber() : ""));

        notificationService.createNotification(saved.getBuyer(),
                "Tracking info added for your order (#" + saved.getId() + ").");

        return mapToResponse(saved);
    }

    private void recordStatusHistory(Order order, OrderStatus status, String note) {
        statusHistoryRepository.save(
                OrderStatusHistory.builder()
                        .order(order)
                        .status(status)
                        .note(note)
                        .build()
        );
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // MAPPER
    public OrderResponse mapToResponse(Order order) {

        List<OrderResponse.OrderItemResponse> items = order.getItems() == null
                ? List.of()
                : order.getItems().stream()
                    .map(i -> OrderResponse.OrderItemResponse.builder()
                            .id(i.getId())
                            .productId(i.getProduct().getId())
                            .productName(i.getProduct().getProductName())
                            .quantity(i.getQuantity())
                            .price(i.getPrice())
                            .build())
                    .toList();

        List<OrderResponse.OrderStatusHistoryResponse> history =
                statusHistoryRepository.findByOrder_IdOrderByCreatedAtAsc(order.getId())
                        .stream()
                        .map(h -> OrderResponse.OrderStatusHistoryResponse.builder()
                                .status(h.getStatus().name())
                                .note(h.getNote())
                                .createdAt(h.getCreatedAt())
                                .build())
                        .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .paid(order.isPaid())
                .paymentMethod(order.getPaymentMethod())
                .totalPrice(order.getTotalPrice())
                .buyerName(order.getBuyer().getName())
                .paymentId(order.getPaymentId())
                .createdAt(order.getCreatedAt())
                .items(items)
                .deliveryName(order.getDeliveryName())
                .deliveryPhone(order.getDeliveryPhone())
                .deliveryAddressLine(order.getDeliveryAddressLine())
                .deliveryCity(order.getDeliveryCity())
                .deliveryState(order.getDeliveryState())
                .deliveryPincode(order.getDeliveryPincode())
                .couponCode(order.getCouponCode())
                .discount(order.getDiscount())
                .carrier(order.getCarrier())
                .trackingNumber(order.getTrackingNumber())
                .trackingUrl(order.getTrackingUrl())
                .expectedDeliveryDate(order.getExpectedDeliveryDate())
                .deliveredAt(order.getDeliveredAt())
                .statusHistory(history)
                .build();
    }
}
