package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.TaxRecordRequest;
import com.example.AgriConnect.dto.response.TaxRecordResponse;
import com.example.AgriConnect.service.TaxRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tax-records")
@RequiredArgsConstructor
public class TaxRecordController {

    private final TaxRecordService taxRecordService;

    // GOVERNMENT creates a tax record against a farmer/brand account.
    @PostMapping
    public ResponseEntity<TaxRecordResponse> create(
            @RequestBody @Valid TaxRecordRequest request,
            Authentication auth) {
        return ResponseEntity.ok(taxRecordService.create(auth.getName(), request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TaxRecordResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String remarks) {
        return ResponseEntity.ok(taxRecordService.updateStatus(id, status, remarks));
    }

    // GOVERNMENT — every tax record, across all farmers/brands.
    @GetMapping
    public ResponseEntity<List<TaxRecordResponse>> getAll() {
        return ResponseEntity.ok(taxRecordService.getAll());
    }

    // Farmer/brand — their own tax records.
    @GetMapping("/mine")
    public ResponseEntity<List<TaxRecordResponse>> getMine(Authentication auth) {
        return ResponseEntity.ok(taxRecordService.getMine(auth.getName()));
    }
}
