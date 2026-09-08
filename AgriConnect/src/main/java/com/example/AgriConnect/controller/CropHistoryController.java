package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.CropHistoryRequest;
import com.example.AgriConnect.dto.response.CropHistoryResponse;
import com.example.AgriConnect.service.CropHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// A farmer's own day-to-day / season-to-season crop log: what was planted,
// what it yielded, and what it cost vs sold for — separate from the
// marketplace `Product` listings.
@RestController
@RequestMapping("/api/farmer/crop-history")
@RequiredArgsConstructor
public class CropHistoryController {

    private final CropHistoryService cropHistoryService;

    @PostMapping
    public ResponseEntity<CropHistoryResponse> addRecord(
            @Valid @RequestBody CropHistoryRequest request,
            Authentication auth) {

        return ResponseEntity.ok(cropHistoryService.addRecord(request, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<CropHistoryResponse>> getMyRecords(Authentication auth) {
        return ResponseEntity.ok(cropHistoryService.getMyRecords(auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id, Authentication auth) {
        cropHistoryService.deleteRecord(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
