package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.CreateWarehouseReceiptRequest;
import com.example.AgriConnect.dto.request.QualityInspectionRequest;
import com.example.AgriConnect.dto.response.WarehouseReceiptResponse;
import com.example.AgriConnect.service.WarehouseReceiptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouse-receipts")
@RequiredArgsConstructor
public class WarehouseReceiptController {

    private final WarehouseReceiptService receiptService;

    // Farmer requests a receipt for produce stored at their own warehouse.
    @PostMapping
    public ResponseEntity<WarehouseReceiptResponse> create(
            @RequestBody @Valid CreateWarehouseReceiptRequest request,
            Authentication auth) {
        return ResponseEntity.ok(receiptService.createReceipt(request, auth.getName()));
    }

    // Government/admin inspector grades a pending receipt.
    @PutMapping("/{id}/inspect")
    public ResponseEntity<WarehouseReceiptResponse> inspect(
            @PathVariable Long id,
            @RequestBody @Valid QualityInspectionRequest request,
            Authentication auth) {
        return ResponseEntity.ok(receiptService.inspect(id, request, auth.getName()));
    }

    // Farmer withdraws produce that was previously issued a receipt.
    @PutMapping("/{id}/withdraw")
    public ResponseEntity<WarehouseReceiptResponse> withdraw(
            @PathVariable Long id,
            Authentication auth) {
        return ResponseEntity.ok(receiptService.withdraw(id, auth.getName()));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<WarehouseReceiptResponse>> getMine(Authentication auth) {
        return ResponseEntity.ok(receiptService.getMine(auth.getName()));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<WarehouseReceiptResponse>> getPending() {
        return ResponseEntity.ok(receiptService.getPending());
    }

    @GetMapping
    public ResponseEntity<List<WarehouseReceiptResponse>> getAll() {
        return ResponseEntity.ok(receiptService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WarehouseReceiptResponse> getById(
            @PathVariable Long id,
            Authentication auth) {
        return ResponseEntity.ok(receiptService.getById(id, auth.getName()));
    }
}
