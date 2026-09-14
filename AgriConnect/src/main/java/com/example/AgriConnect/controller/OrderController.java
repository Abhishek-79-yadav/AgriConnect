package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.CheckoutRequest;
import com.example.AgriConnect.dto.request.ShipmentUpdateRequest;
import com.example.AgriConnect.dto.response.OrderResponse;
import com.example.AgriConnect.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(
            @RequestBody @Valid CheckoutRequest request,
            Authentication auth) {
        return ResponseEntity.ok(orderService.checkout(auth.getName(), request));
    }

    @GetMapping("/buyer")
    public ResponseEntity<List<OrderResponse>> getBuyerOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getBuyerOrders(auth.getName()));
    }

    @GetMapping("/farmer")
    public ResponseEntity<List<OrderResponse>> getFarmerOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getFarmerOrders(auth.getName()));
    }

    // Lets a farmer move one of their orders through its lifecycle
    // (CONFIRMED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED), or cancel it.
    // Also used by a buyer to cancel their own order (enforced in the
    // service layer).
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication auth) {
        return ResponseEntity.ok(orderService.updateStatus(id, status, auth.getName()));
    }

    // Farmer (or admin) attaches/updates carrier + tracking number once an
    // order ships. Buyers see this reflected on their order/tracking view.
    @PutMapping("/{id}/shipment")
    public ResponseEntity<OrderResponse> updateShipment(
            @PathVariable Long id,
            @RequestBody ShipmentUpdateRequest request,
            Authentication auth) {
        return ResponseEntity.ok(orderService.updateShipment(id, request, auth.getName()));
    }
}
