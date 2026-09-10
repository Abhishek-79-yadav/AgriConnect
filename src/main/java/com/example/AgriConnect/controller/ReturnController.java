package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.ReturnRequestCreateRequest;
import com.example.AgriConnect.dto.response.ReturnResponse;
import com.example.AgriConnect.service.ReturnService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
public class ReturnController {

    private final ReturnService returnService;

    // Buyer requests a return on a delivered order (whole order, or one item).
    @PostMapping
    public ResponseEntity<ReturnResponse> requestReturn(
            @RequestBody @Valid ReturnRequestCreateRequest request,
            Authentication auth) {
        return ResponseEntity.ok(returnService.requestReturn(auth.getName(), request));
    }

    @GetMapping("/buyer")
    public ResponseEntity<List<ReturnResponse>> getBuyerReturns(Authentication auth) {
        return ResponseEntity.ok(returnService.getBuyerReturns(auth.getName()));
    }

    @GetMapping("/farmer")
    public ResponseEntity<List<ReturnResponse>> getFarmerReturns(Authentication auth) {
        return ResponseEntity.ok(returnService.getFarmerReturns(auth.getName()));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<ReturnResponse>> getAllReturns(Authentication auth) {
        return ResponseEntity.ok(returnService.getAllReturns(auth.getName()));
    }

    // Farmer (or admin) approves/rejects a REQUESTED return, or marks an
    // APPROVED return COMPLETED once the item is back with the farmer.
    @PutMapping("/{id}/status")
    public ResponseEntity<ReturnResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String note,
            Authentication auth) {
        return ResponseEntity.ok(returnService.updateReturnStatus(id, status, note, auth.getName()));
    }
}
