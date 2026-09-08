package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.AgriInputRequest;
import com.example.AgriConnect.dto.response.AgriInputResponse;
import com.example.AgriConnect.service.AgriInputService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AgriInputController {

    private final AgriInputService agriInputService;

    // ---- Company (BRAND) side — requires active subscription ----
    @PostMapping("/api/brand/agri-inputs")
    public AgriInputResponse create(@RequestBody @Valid AgriInputRequest request, Authentication auth) {
        return agriInputService.create(auth.getName(), request);
    }

    @GetMapping("/api/brand/agri-inputs")
    public List<AgriInputResponse> mine(Authentication auth) {
        return agriInputService.getMine(auth.getName());
    }

    @DeleteMapping("/api/brand/agri-inputs/{id}")
    public String delete(@PathVariable Long id, Authentication auth) {
        agriInputService.delete(auth.getName(), id);
        return "Deleted";
    }

    // ---- Buyer side — requires active subscription ----
    @GetMapping("/api/buyer/agri-inputs")
    public List<AgriInputResponse> browse(Authentication auth) {
        return agriInputService.browse(auth.getName());
    }

    // ---- Farmer-facing marketing banner — no subscription needed ----
    @GetMapping("/api/farmer/agri-input-ads")
    public List<AgriInputResponse> farmerAds() {
        return agriInputService.getFarmerAds();
    }
}
