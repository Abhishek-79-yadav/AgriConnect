package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.CreateEmiPlanRequest;
import com.example.AgriConnect.dto.response.EmiInstallmentResponse;
import com.example.AgriConnect.dto.response.EmiPlanResponse;
import com.example.AgriConnect.service.EmiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emi")
@RequiredArgsConstructor
public class EmiController {

    private final EmiService emiService;

    // Buyer opts an unpaid ONLINE order into an installment schedule.
    @PostMapping("/orders/{orderId}")
    public ResponseEntity<EmiPlanResponse> createPlan(
            @PathVariable Long orderId,
            @RequestBody @Valid CreateEmiPlanRequest request,
            Authentication auth) {
        return ResponseEntity.ok(
                emiService.createPlan(orderId, request.getNumberOfInstallments(), auth.getName())
        );
    }

    @GetMapping("/buyer")
    public ResponseEntity<List<EmiPlanResponse>> getBuyerPlans(Authentication auth) {
        return ResponseEntity.ok(emiService.getBuyerPlans(auth.getName()));
    }

    // Pays one installment out of the buyer's wallet balance.
    @PostMapping("/installments/{installmentId}/pay")
    public ResponseEntity<EmiInstallmentResponse> payInstallment(
            @PathVariable Long installmentId,
            Authentication auth) {
        return ResponseEntity.ok(emiService.payInstallment(installmentId, auth.getName()));
    }
}
