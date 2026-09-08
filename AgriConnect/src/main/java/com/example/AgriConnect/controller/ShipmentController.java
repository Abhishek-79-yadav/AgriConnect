package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.CreateShipmentRequest;
import com.example.AgriConnect.dto.request.DeliveryAttemptRequest;
import com.example.AgriConnect.dto.request.ShipmentEventRequest;
import com.example.AgriConnect.dto.response.ShipmentResponse;
import com.example.AgriConnect.service.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    // Farmer (or admin) opens a shipment once an order is CONFIRMED.
    @PostMapping("/api/orders/{orderId}/shipment")
    public ResponseEntity<ShipmentResponse> createShipment(
            @PathVariable Long orderId,
            @RequestBody CreateShipmentRequest request,
            Authentication auth) {
        return ResponseEntity.ok(shipmentService.createShipment(orderId, request, auth.getName()));
    }

    // Buyer / fulfilling farmer / admin view the shipment + full timeline.
    @GetMapping("/api/orders/{orderId}/shipment")
    public ResponseEntity<ShipmentResponse> getByOrder(
            @PathVariable Long orderId,
            Authentication auth) {
        return ResponseEntity.ok(shipmentService.getByOrder(orderId, auth.getName()));
    }

    // Farmer (or admin) logs a tracking checkpoint (PICKED_UP, IN_TRANSIT,
    // OUT_FOR_DELIVERY, etc). For DELIVERED / DELIVERY_FAILED use the
    // delivery-attempt endpoint instead.
    @PostMapping("/api/shipments/{id}/events")
    public ResponseEntity<ShipmentResponse> addEvent(
            @PathVariable Long id,
            @RequestBody @Valid ShipmentEventRequest request,
            Authentication auth) {
        return ResponseEntity.ok(shipmentService.addEvent(id, request, auth.getName()));
    }

    // Farmer (or admin) records a delivery attempt — success (with proof
    // of delivery) or failure (with a reason, expecting a re-attempt).
    @PostMapping("/api/shipments/{id}/delivery-attempt")
    public ResponseEntity<ShipmentResponse> recordDeliveryAttempt(
            @PathVariable Long id,
            @RequestBody DeliveryAttemptRequest request,
            Authentication auth) {
        return ResponseEntity.ok(shipmentService.recordDeliveryAttempt(id, request, auth.getName()));
    }
}
