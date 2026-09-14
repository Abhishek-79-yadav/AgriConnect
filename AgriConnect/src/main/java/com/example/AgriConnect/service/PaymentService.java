package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.OrderResponse;
import com.example.AgriConnect.dto.response.RazorpayOrderResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.OrderRepository;
import com.example.AgriConnect.repository.CartRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    // Doesn't block startup (sandbox keys are legitimate in dev/staging) —
    // just makes it impossible to miss in the logs if a deployment meant to
    // be production is still quietly running on Razorpay's test keys.
    @jakarta.annotation.PostConstruct
    private void warnIfTestKey() {
        if (key != null && key.startsWith("rzp_test_")) {
            org.slf4j.LoggerFactory.getLogger(PaymentService.class)
                    .warn("Razorpay is configured with a TEST key (rzp_test_...) — " +
                            "real payments will not work. Set RAZORPAY_KEY/RAZORPAY_SECRET " +
                            "to live credentials before going to production.");
        }
    }

    /**
     * Creates a Razorpay order. Caller (buyer) must own the order, otherwise
     * anyone could generate a payment order against someone else's order id.
     */
    public RazorpayOrderResponse createRazorpayOrder(Long orderId, String requesterEmail) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getBuyer().getEmail().equalsIgnoreCase(requesterEmail)) {
            throw new ApiException("You are not allowed to pay for this order");
        }

        if (order.isPaid()) {
            throw new ApiException("Order is already paid");
        }

        try {
            RazorpayClient client = new RazorpayClient(key, secret);

            long amountInPaise = Math.round(order.getTotalPrice() * 100);

            JSONObject options = new JSONObject();
            options.put("amount", amountInPaise);
            options.put("currency", "INR");
            options.put("receipt", "order_" + orderId);

            com.razorpay.Order rOrder = client.orders.create(options);

            // Store the gateway order id so verify() can bind the two together.
            order.setRazorpayOrderId(rOrder.get("id"));
            orderRepository.save(order);

            return RazorpayOrderResponse.builder()
                    .razorpayOrderId(rOrder.get("id"))
                    .amount(amountInPaise)
                    .currency("INR")
                    .razorpayKey(key)
                    .build();

        } catch (Exception e) {
            throw new ApiException("Unable to create payment order: " + e.getMessage());
        }
    }

    /**
     * Verifies the Razorpay payment signature server-side before marking an
     * order as paid. NEVER trust a client-supplied "paid" flag without this.
     *
     * Razorpay signature = HMAC_SHA256(razorpayOrderId + "|" + razorpayPaymentId, secret)
     */
    @Transactional
    public OrderResponse verifyPayment(Long orderId,
                                       String requesterEmail,
                                       String razorpayOrderId,
                                       String razorpayPaymentId,
                                       String razorpaySignature) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getBuyer().getEmail().equalsIgnoreCase(requesterEmail)) {
            throw new ApiException("You are not allowed to verify this order");
        }

        if (order.getRazorpayOrderId() == null
                || !order.getRazorpayOrderId().equals(razorpayOrderId)) {
            throw new ApiException("Razorpay order id does not match this order");
        }

        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", razorpayOrderId);
        options.put("razorpay_payment_id", razorpayPaymentId);
        options.put("razorpay_signature", razorpaySignature);

        boolean signatureValid;
        try {
            signatureValid = Utils.verifyPaymentSignature(options, secret);
        } catch (Exception e) {
            throw new ApiException("Signature verification failed: " + e.getMessage());
        }

        if (!signatureValid) {
            throw new ApiException("Invalid payment signature — payment could not be verified");
        }

        order.setPaid(true);
        order.setPaymentId(razorpayPaymentId);
        order.setStatus(OrderStatus.CONFIRMED);

        Order saved = orderRepository.save(order);

        // Cart rows for this order's items were already removed at
        // checkout() time (see OrderService) — nothing left to clear here.

        return mapToResponse(saved);
    }

    private OrderResponse mapToResponse(Order order) {

        List<OrderResponse.OrderItemResponse> items = order.getItems() == null
                ? List.of()
                : order.getItems().stream()
                    .map(i -> OrderResponse.OrderItemResponse.builder()
                            .productId(i.getProduct().getId())
                            .productName(i.getProduct().getProductName())
                            .quantity(i.getQuantity())
                            .price(i.getPrice())
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
                .build();
    }
}
