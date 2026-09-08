package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.ContractDeliveryRequest;
import com.example.AgriConnect.dto.request.CreateContractRequest;
import com.example.AgriConnect.dto.response.ContractResponse;
import com.example.AgriConnect.service.ContractService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    // Buyer or brand proposes a contract to a farmer.
    @PostMapping
    public ResponseEntity<ContractResponse> createContract(
            @RequestBody @Valid CreateContractRequest request,
            Authentication auth) {
        return ResponseEntity.ok(contractService.createContract(request, auth.getName()));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ContractResponse>> getMineAsBuyer(Authentication auth) {
        return ResponseEntity.ok(contractService.getMineAsBuyer(auth.getName()));
    }

    @GetMapping("/farmer")
    public ResponseEntity<List<ContractResponse>> getMineAsFarmer(Authentication auth) {
        return ResponseEntity.ok(contractService.getMineAsFarmer(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractResponse> getById(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(contractService.getById(id, auth.getName()));
    }

    // Farmer accepts a proposed contract — becomes binding (ACTIVE).
    @PutMapping("/{id}/accept")
    public ResponseEntity<ContractResponse> accept(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(contractService.accept(id, auth.getName()));
    }

    // Farmer rejects a proposed contract.
    @PutMapping("/{id}/reject")
    public ResponseEntity<ContractResponse> reject(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(contractService.reject(id, auth.getName()));
    }

    // Either party cancels — only before any delivery has happened.
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ContractResponse> cancel(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(contractService.cancel(id, auth.getName()));
    }

    // Farmer records a delivery batch against an active contract.
    @PostMapping("/{id}/deliveries")
    public ResponseEntity<ContractResponse> recordDelivery(
            @PathVariable Long id,
            @RequestBody @Valid ContractDeliveryRequest request,
            Authentication auth) {
        return ResponseEntity.ok(contractService.recordDelivery(id, request, auth.getName()));
    }

    // Buyer (or admin) marks a contract as breached — e.g. deadline
    // passed without delivery.
    @PutMapping("/{id}/breach")
    public ResponseEntity<ContractResponse> markBreached(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(contractService.markBreached(id, auth.getName()));
    }
}
