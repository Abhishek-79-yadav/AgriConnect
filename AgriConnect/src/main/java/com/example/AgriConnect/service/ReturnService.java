package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.ReturnRequestCreateRequest;
import com.example.AgriConnect.dto.response.ReturnResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReturnService {

    private final ReturnRequestRepository returnRequestRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;
    private final RefundService refundService;

    // BUYER REQUESTS A RETURN — only on their own, DELIVERED orders.
    @Transactional
    public ReturnResponse requestReturn(String email, ReturnRequestCreateRequest request) {

        User buyer = getUser(email);

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getBuyer().getId().equals(buyer.getId())) {
            throw new ApiException("You can only request a return on your own order");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new ApiException("Only delivered orders are eligible for return");
        }

        OrderItem orderItem = null;
        if (request.getOrderItemId() != null) {
            orderItem = orderItemRepository.findById(request.getOrderItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));
            if (!orderItem.getOrder().getId().equals(order.getId())) {
                throw new ApiException("That item does not belong to this order");
            }
        }

        ReturnRequest returnRequest = ReturnRequest.builder()
                .order(order)
                .orderItem(orderItem)
                .buyer(buyer)
                .reason(request.getReason())
                .status(ReturnStatus.REQUESTED)
                .build();

        ReturnRequest saved = returnRequestRepository.save(returnRequest);

        // Notify every farmer with a stake in this order, same dedupe
        // pattern as new-order notifications in OrderService.
        order.getItems().stream()
                .map(item -> item.getProduct().getFarmer())
                .distinct()
                .forEach(farmer -> notificationService.createNotification(
                        farmer,
                        "A return was requested for order #" + order.getId() + "."
                ));

        return mapToResponse(saved);
    }

    // BUYER: their own return requests
    public List<ReturnResponse> getBuyerReturns(String email) {
        User buyer = getUser(email);
        return returnRequestRepository.findByBuyer_IdOrderByRequestedAtDesc(buyer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    // FARMER: returns on orders containing their products
    public List<ReturnResponse> getFarmerReturns(String email) {
        User farmer = getUser(email);
        return returnRequestRepository.findFarmerReturns(farmer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    // ADMIN: all returns
    public List<ReturnResponse> getAllReturns(String email) {
        User user = getUser(email);
        if (user.getRole() != Role.ADMIN && user.getRole() != Role.SUPER_ADMIN) {
            throw new ApiException("Admin access required");
        }
        return returnRequestRepository.findAll()
                .stream().map(this::mapToResponse).toList();
    }

    // FARMER (or ADMIN) APPROVES / REJECTS / COMPLETES a return.
    // APPROVED -> COMPLETED restocks the item(s), since that's the point
    // where the farmer actually has the goods back in hand.
    @Transactional
    public ReturnResponse updateReturnStatus(Long returnId, String statusValue, String adminNote, String email) {

        User user = getUser(email);

        ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found"));

        boolean isAdmin = user.getRole() == Role.ADMIN;

        boolean ownsAnItem = returnRequest.getOrder().getItems().stream()
                .anyMatch(item -> item.getProduct().getFarmer().getId().equals(user.getId()));

        if (!isAdmin && !ownsAnItem) {
            throw new ApiException("You can only manage returns on orders containing your own products");
        }

        ReturnStatus newStatus;
        try {
            newStatus = ReturnStatus.valueOf(statusValue.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid return status: " + statusValue);
        }

        ReturnStatus current = returnRequest.getStatus();

        boolean validTransition =
                (current == ReturnStatus.REQUESTED && (newStatus == ReturnStatus.APPROVED || newStatus == ReturnStatus.REJECTED))
                        || (current == ReturnStatus.APPROVED && newStatus == ReturnStatus.COMPLETED);

        if (!validTransition) {
            throw new ApiException("Can't move a return from " + current + " to " + newStatus);
        }

        if (newStatus == ReturnStatus.COMPLETED) {
            if (returnRequest.getOrderItem() != null) {
                restock(returnRequest.getOrderItem());
            } else {
                returnRequest.getOrder().getItems().forEach(this::restock);
            }

            // Only refund money that was actually collected. An unpaid
            // COD order that somehow reached DELIVERED without payment
            // being marked (shouldn't happen, but not this method's job
            // to assume) has nothing to hand back.
            if (returnRequest.getOrder().isPaid()) {
                double amount = returnRequest.getOrderItem() != null
                        ? returnRequest.getOrderItem().getPrice()
                        : returnRequest.getOrder().getTotalPrice();

                refundService.initiateRefund(
                        returnRequest.getOrder(),
                        returnRequest.getOrderItem(),
                        amount,
                        "Return #" + returnRequest.getId() + " completed"
                );
            }
        }

        returnRequest.setStatus(newStatus);
        returnRequest.setAdminNote(adminNote);
        returnRequest.setResolvedAt(LocalDateTime.now());

        ReturnRequest saved = returnRequestRepository.save(returnRequest);

        notificationService.createNotification(saved.getBuyer(),
                "Your return request for order #" + saved.getOrder().getId() + " was " + newStatus.name().toLowerCase() + ".");

        return mapToResponse(saved);
    }

    private void restock(OrderItem item) {
        Product p = item.getProduct();
        p.setQuantity(p.getQuantity() + item.getQuantity());
        productRepository.save(p);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ReturnResponse mapToResponse(ReturnRequest r) {
        return ReturnResponse.builder()
                .id(r.getId())
                .orderId(r.getOrder().getId())
                .orderItemId(r.getOrderItem() != null ? r.getOrderItem().getId() : null)
                .productName(r.getOrderItem() != null ? r.getOrderItem().getProduct().getProductName() : null)
                .buyerName(r.getBuyer().getName())
                .reason(r.getReason())
                .status(r.getStatus().name())
                .adminNote(r.getAdminNote())
                .requestedAt(r.getRequestedAt())
                .resolvedAt(r.getResolvedAt())
                .build();
    }
}
