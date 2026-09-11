package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.CreateShipmentRequest;
import com.example.AgriConnect.dto.request.DeliveryAttemptRequest;
import com.example.AgriConnect.dto.request.ShipmentEventRequest;
import com.example.AgriConnect.dto.response.ShipmentResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

// Proper logistics module — sits on top of Order's existing flat
// carrier/trackingNumber/trackingUrl/deliveredAt fields (kept in sync
// here on every transition) and adds what that flat tracking couldn't:
// a structured checkpoint timeline with location, delivery-agent
// assignment, and real delivery-attempt tracking (success/fail/retry).
@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentEventRepository shipmentEventRepository;
    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // FARMER (or ADMIN) OPENS A SHIPMENT FOR AN ORDER THEY'RE FULFILLING
    @Transactional
    public ShipmentResponse createShipment(Long orderId, CreateShipmentRequest request, String email) {

        User user = getUser(email);
        Order order = getOrder(orderId);

        requireFulfiller(order, user);

        if (order.getStatus() != OrderStatus.CONFIRMED) {
            throw new ApiException("Order must be CONFIRMED before a shipment can be created (currently "
                    + order.getStatus() + ")");
        }

        if (shipmentRepository.existsByOrder_Id(orderId)) {
            throw new ApiException("A shipment already exists for this order");
        }

        Shipment shipment = Shipment.builder()
                .order(order)
                .status(ShipmentStatus.CREATED)
                .carrier(request.getCarrier())
                .trackingNumber(request.getTrackingNumber())
                .trackingUrl(request.getTrackingUrl())
                .deliveryAgentName(request.getDeliveryAgentName())
                .deliveryAgentPhone(request.getDeliveryAgentPhone())
                .vehicleNumber(request.getVehicleNumber())
                .expectedDeliveryDate(request.getExpectedDeliveryDate())
                .build();

        Shipment saved = shipmentRepository.save(shipment);

        addEventInternal(saved, ShipmentStatus.CREATED, null, "Shipment created");

        // Keep Order's own flat fields in sync so existing code (buyer
        // tracking view, OrderResponse) reflects this immediately.
        order.setCarrier(request.getCarrier());
        order.setTrackingNumber(request.getTrackingNumber());
        order.setTrackingUrl(request.getTrackingUrl());
        order.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
        order.setStatus(OrderStatus.SHIPPED);
        orderRepository.save(order);

        recordOrderHistory(order, OrderStatus.SHIPPED, "Shipment created" +
                (request.getCarrier() != null ? " — " + request.getCarrier() : ""));

        notificationService.createNotification(order.getBuyer(),
                "Your order #" + order.getId() + " has shipped.");

        return mapToResponse(saved);
    }

    // FARMER (or ADMIN) ADDS A TRACKING CHECKPOINT
    @Transactional
    public ShipmentResponse addEvent(Long shipmentId, ShipmentEventRequest request, String email) {

        User user = getUser(email);
        Shipment shipment = getShipment(shipmentId);
        Order order = shipment.getOrder();

        requireFulfiller(order, user);
        requireNotFinal(shipment);

        ShipmentStatus newStatus;
        try {
            newStatus = ShipmentStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid shipment status: " + request.getStatus());
        }

        if (newStatus == ShipmentStatus.DELIVERED || newStatus == ShipmentStatus.DELIVERY_FAILED) {
            throw new ApiException("Use the delivery-attempt endpoint to record " + newStatus);
        }

        if (newStatus == ShipmentStatus.PICKED_UP) {
            shipment.setPickedUpAt(LocalDateTime.now());
        }

        shipment.setStatus(newStatus);
        shipmentRepository.save(shipment);

        addEventInternal(shipment, newStatus, request.getLocation(), request.getNote());

        OrderStatus orderStatus = (newStatus == ShipmentStatus.OUT_FOR_DELIVERY)
                ? OrderStatus.OUT_FOR_DELIVERY
                : order.getStatus();

        if (orderStatus != order.getStatus()) {
            order.setStatus(orderStatus);
            orderRepository.save(order);
        }

        recordOrderHistory(order, orderStatus,
                newStatus + (request.getLocation() != null ? " — " + request.getLocation() : ""));

        if (newStatus == ShipmentStatus.OUT_FOR_DELIVERY) {
            notificationService.createNotification(order.getBuyer(),
                    "Your order #" + order.getId() + " is out for delivery.");
        }

        return mapToResponse(shipment);
    }

    // RECORDS ONE DELIVERY ATTEMPT — SUCCESS OR FAILURE
    @Transactional
    public ShipmentResponse recordDeliveryAttempt(Long shipmentId, DeliveryAttemptRequest request, String email) {

        User user = getUser(email);
        Shipment shipment = getShipment(shipmentId);
        Order order = shipment.getOrder();

        requireFulfiller(order, user);
        requireNotFinal(shipment);

        shipment.setDeliveryAttempts(shipment.getDeliveryAttempts() + 1);

        if (request.isSuccessful()) {
            shipment.setStatus(ShipmentStatus.DELIVERED);
            shipment.setDeliveredAt(LocalDateTime.now());
            shipment.setProofOfDeliveryName(request.getRecipientName());
            shipment.setProofOfDeliveryNote(request.getNote());
            shipmentRepository.save(shipment);

            addEventInternal(shipment, ShipmentStatus.DELIVERED, null,
                    "Delivered" + (request.getRecipientName() != null
                            ? " — received by " + request.getRecipientName() : ""));

            order.setStatus(OrderStatus.DELIVERED);
            order.setDeliveredAt(shipment.getDeliveredAt());
            // Same COD-collection rule OrderService.updateStatus() applies:
            // cash changes hands at the moment of delivery.
            if ("COD".equalsIgnoreCase(order.getPaymentMethod())) {
                order.setPaid(true);
            }
            orderRepository.save(order);

            recordOrderHistory(order, OrderStatus.DELIVERED, "Delivered" +
                    (request.getRecipientName() != null ? " — received by " + request.getRecipientName() : ""));

            notificationService.createNotification(order.getBuyer(),
                    "Your order #" + order.getId() + " has been delivered.");
        } else {
            shipment.setStatus(ShipmentStatus.DELIVERY_FAILED);
            shipmentRepository.save(shipment);

            addEventInternal(shipment, ShipmentStatus.DELIVERY_FAILED, null,
                    request.getReason() != null ? request.getReason() : "Delivery attempt failed");

            recordOrderHistory(order, order.getStatus(),
                    "Delivery attempt failed" + (request.getReason() != null ? " — " + request.getReason() : "")
                            + " (attempt #" + shipment.getDeliveryAttempts() + ")");

            notificationService.createNotification(order.getBuyer(),
                    "A delivery attempt for your order #" + order.getId() + " failed" +
                            (request.getReason() != null ? " — " + request.getReason() : "")
                            + ". A re-attempt will be made.");
        }

        return mapToResponse(shipment);
    }

    // BUYER / FULFILLING FARMER / ADMIN VIEW THE SHIPMENT + FULL TIMELINE
    public ShipmentResponse getByOrder(Long orderId, String email) {

        User user = getUser(email);
        Order order = getOrder(orderId);

        boolean isBuyer = order.getBuyer().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN || user.getRole() == Role.SUPER_ADMIN;
        boolean ownsAnItem = order.getItems().stream()
                .anyMatch(item -> item.getProduct().getFarmer().getId().equals(user.getId()));

        if (!isBuyer && !isAdmin && !ownsAnItem) {
            throw new ApiException("You don't have access to this order's shipment");
        }

        Shipment shipment = shipmentRepository.findByOrder_Id(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("No shipment has been created for this order yet"));

        return mapToResponse(shipment);
    }

    // Only the farmer fulfilling the order (owns a line item) or an admin
    // may manage its shipment — same rule OrderService applies to status
    // updates, kept consistent here.
    private void requireFulfiller(Order order, User user) {
        boolean isAdmin = user.getRole() == Role.ADMIN || user.getRole() == Role.SUPER_ADMIN;
        boolean ownsAnItem = order.getItems().stream()
                .anyMatch(item -> item.getProduct().getFarmer().getId().equals(user.getId()));

        if (!isAdmin && !ownsAnItem) {
            throw new ApiException("You can only manage shipments for orders containing your own products");
        }
    }

    private void requireNotFinal(Shipment shipment) {
        if (shipment.getStatus() == ShipmentStatus.DELIVERED
                || shipment.getStatus() == ShipmentStatus.CANCELLED
                || shipment.getStatus() == ShipmentStatus.RETURNED) {
            throw new ApiException("This shipment is already " + shipment.getStatus() + " and can't be updated");
        }
    }

    private void addEventInternal(Shipment shipment, ShipmentStatus status, String location, String note) {
        shipmentEventRepository.save(
                ShipmentEvent.builder()
                        .shipment(shipment)
                        .status(status)
                        .location(location)
                        .note(note)
                        .build()
        );
    }

    private void recordOrderHistory(Order order, OrderStatus status, String note) {
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

    private Order getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    private Shipment getShipment(Long shipmentId) {
        return shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));
    }

    private ShipmentResponse mapToResponse(Shipment shipment) {

        List<ShipmentEvent> events = shipmentEventRepository
                .findByShipment_IdOrderByCreatedAtAsc(shipment.getId());

        return ShipmentResponse.builder()
                .id(shipment.getId())
                .orderId(shipment.getOrder().getId())
                .status(shipment.getStatus().name())
                .carrier(shipment.getCarrier())
                .trackingNumber(shipment.getTrackingNumber())
                .trackingUrl(shipment.getTrackingUrl())
                .deliveryAgentName(shipment.getDeliveryAgentName())
                .deliveryAgentPhone(shipment.getDeliveryAgentPhone())
                .vehicleNumber(shipment.getVehicleNumber())
                .expectedDeliveryDate(shipment.getExpectedDeliveryDate())
                .pickedUpAt(shipment.getPickedUpAt())
                .deliveredAt(shipment.getDeliveredAt())
                .deliveryAttempts(shipment.getDeliveryAttempts())
                .proofOfDeliveryName(shipment.getProofOfDeliveryName())
                .proofOfDeliveryNote(shipment.getProofOfDeliveryNote())
                .createdAt(shipment.getCreatedAt())
                .updatedAt(shipment.getUpdatedAt())
                .events(events.stream().map(e -> ShipmentResponse.ShipmentEventResponse.builder()
                                .id(e.getId())
                                .status(e.getStatus().name())
                                .location(e.getLocation())
                                .note(e.getNote())
                                .createdAt(e.getCreatedAt())
                                .build())
                        .toList())
                .build();
    }
}
