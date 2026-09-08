package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.SchemeApplicationRequest;
import com.example.AgriConnect.dto.response.SchemeApplicationResponse;
import com.example.AgriConnect.service.SchemeApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheme-applications")
@RequiredArgsConstructor
public class SchemeApplicationController {

    private final SchemeApplicationService applicationService;

    // Farmer applies to a scheme.
    @PostMapping
    public ResponseEntity<SchemeApplicationResponse> apply(
            @RequestBody @Valid SchemeApplicationRequest request,
            Authentication auth) {
        return ResponseEntity.ok(applicationService.apply(auth.getName(), request));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<SchemeApplicationResponse>> getMine(Authentication auth) {
        return ResponseEntity.ok(applicationService.getMine(auth.getName()));
    }

    // Government — every application.
    @GetMapping
    public ResponseEntity<List<SchemeApplicationResponse>> getAll() {
        return ResponseEntity.ok(applicationService.getAll());
    }

    // Document verification — a distinct step from the final decision.
    @PutMapping("/{id}/verify-documents")
    public ResponseEntity<SchemeApplicationResponse> verifyDocuments(
            @PathVariable Long id,
            @RequestParam boolean verified,
            @RequestParam(required = false) String remarks,
            Authentication auth) {
        return ResponseEntity.ok(applicationService.verifyDocuments(id, auth.getName(), verified, remarks));
    }

    // Approve/reject.
    @PutMapping("/{id}/decision")
    public ResponseEntity<SchemeApplicationResponse> decide(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String remarks,
            Authentication auth) {
        return ResponseEntity.ok(applicationService.decide(id, auth.getName(), status, remarks));
    }
}
