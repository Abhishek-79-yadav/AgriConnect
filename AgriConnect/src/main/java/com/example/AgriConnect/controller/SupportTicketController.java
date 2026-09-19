package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.SupportTicketRequest;
import com.example.AgriConnect.dto.response.SupportTicketResponse;
import com.example.AgriConnect.service.SupportTicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    // Any logged-in user (buyer, farmer, brand) can file a general support
    // ticket from the Help Center's "Contact us" form.
    @PostMapping("/tickets")
    public ResponseEntity<SupportTicketResponse> create(
            @RequestBody @Valid SupportTicketRequest request,
            Authentication auth) {
        return ResponseEntity.ok(supportTicketService.create(auth.getName(), request));
    }

    @GetMapping("/tickets/mine")
    public ResponseEntity<List<SupportTicketResponse>> getMine(Authentication auth) {
        return ResponseEntity.ok(supportTicketService.getMine(auth.getName()));
    }
}
