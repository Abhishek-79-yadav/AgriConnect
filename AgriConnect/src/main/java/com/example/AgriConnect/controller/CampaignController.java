package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.CampaignRequest;
import com.example.AgriConnect.dto.response.CampaignResponse;
import com.example.AgriConnect.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    // ---------------- Public — homepage banners, promo strips, etc. ----------------

    // role: "ALL" | "BUYER" | "FARMER" — defaults to ALL (public visitors).
    @GetMapping("/api/campaigns/live")
    public ResponseEntity<List<CampaignResponse>> getLive(
            @RequestParam(defaultValue = "ALL") String role) {
        return ResponseEntity.ok(campaignService.getLive(role));
    }

    @PostMapping("/api/campaigns/{id}/impression")
    public ResponseEntity<Void> recordImpression(@PathVariable Long id) {
        campaignService.recordImpression(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/campaigns/{id}/click")
    public ResponseEntity<Void> recordClick(@PathVariable Long id) {
        campaignService.recordClick(id);
        return ResponseEntity.noContent().build();
    }

    // ---------------- Admin — full campaign management ----------------

    @PostMapping("/api/admin/campaigns")
    public ResponseEntity<CampaignResponse> create(
            @RequestBody @Valid CampaignRequest request,
            Authentication auth) {
        return ResponseEntity.ok(campaignService.create(auth.getName(), request));
    }

    @PutMapping("/api/admin/campaigns/{id}")
    public ResponseEntity<CampaignResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid CampaignRequest request) {
        return ResponseEntity.ok(campaignService.update(id, request));
    }

    @PutMapping("/api/admin/campaigns/{id}/status")
    public ResponseEntity<CampaignResponse> setStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(campaignService.setStatus(id, status));
    }

    @DeleteMapping("/api/admin/campaigns/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        campaignService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/admin/campaigns")
    public ResponseEntity<List<CampaignResponse>> getAll() {
        return ResponseEntity.ok(campaignService.getAll());
    }
}
