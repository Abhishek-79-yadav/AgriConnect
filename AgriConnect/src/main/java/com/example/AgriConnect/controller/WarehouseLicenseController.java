package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.WarehouseLicenseRequest;
import com.example.AgriConnect.dto.response.WarehouseLicenseResponse;
import com.example.AgriConnect.service.WarehouseLicenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/warehouse-licenses")
@RequiredArgsConstructor
public class WarehouseLicenseController {

    private final WarehouseLicenseService licenseService;

    // FARMER applies for a license on one of their warehouses.
    @PostMapping
    public ResponseEntity<WarehouseLicenseResponse> apply(
            @RequestBody @Valid WarehouseLicenseRequest request,
            Authentication auth) {
        return ResponseEntity.ok(licenseService.apply(auth.getName(), request));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<WarehouseLicenseResponse>> getMine(Authentication auth) {
        return ResponseEntity.ok(licenseService.getMine(auth.getName()));
    }

    // GOVERNMENT (or admin) — every application.
    @GetMapping
    public ResponseEntity<List<WarehouseLicenseResponse>> getAll() {
        return ResponseEntity.ok(licenseService.getAll());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<WarehouseLicenseResponse> approve(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expiryDate,
            Authentication auth) {
        return ResponseEntity.ok(licenseService.approve(id, auth.getName(), expiryDate));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<WarehouseLicenseResponse> reject(
            @PathVariable Long id,
            @RequestParam(required = false) String remarks,
            Authentication auth) {
        return ResponseEntity.ok(licenseService.reject(id, auth.getName(), remarks));
    }

    // The "check the warehouse license and cancel it" action.
    @PutMapping("/{id}/cancel")
    public ResponseEntity<WarehouseLicenseResponse> cancel(
            @PathVariable Long id,
            @RequestParam(required = false) String remarks,
            Authentication auth) {
        return ResponseEntity.ok(licenseService.cancel(id, auth.getName(), remarks));
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<WarehouseLicenseResponse> suspend(
            @PathVariable Long id,
            @RequestParam(required = false) String remarks,
            Authentication auth) {
        return ResponseEntity.ok(licenseService.suspend(id, auth.getName(), remarks));
    }

    @PutMapping("/{id}/resume")
    public ResponseEntity<WarehouseLicenseResponse> resume(
            @PathVariable Long id,
            Authentication auth) {
        return ResponseEntity.ok(licenseService.resume(id, auth.getName()));
    }

    @PutMapping("/{id}/renew")
    public ResponseEntity<WarehouseLicenseResponse> renew(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newExpiryDate,
            Authentication auth) {
        return ResponseEntity.ok(licenseService.renew(id, auth.getName(), newExpiryDate));
    }
}
