package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.DisputeRequest;
import com.example.AgriConnect.dto.response.DisputeResponse;
import com.example.AgriConnect.service.AuditService;
import com.example.AgriConnect.service.DisputeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DisputeController {

    private final DisputeService disputeService;
    private final AuditService auditService;

    @PostMapping("/api/buyer/disputes")
    public DisputeResponse file(@RequestBody @Valid DisputeRequest request, Authentication auth) {
        return disputeService.file(auth.getName(), request);
    }

    @GetMapping("/api/buyer/disputes")
    public List<DisputeResponse> mine(Authentication auth) {
        return disputeService.getMine(auth.getName());
    }

    @GetMapping("/api/admin/disputes")
    public List<DisputeResponse> all() {
        return disputeService.getAll();
    }

    @PutMapping("/api/admin/disputes/{id}/resolve")
    public DisputeResponse resolve(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String response) {

        DisputeResponse result = disputeService.resolve(id, status, response);
        auditService.log("Resolved dispute #" + id + " as " + status);
        return result;
    }
}
