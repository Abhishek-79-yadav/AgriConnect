package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.CropSuggestionRequest;
import com.example.AgriConnect.dto.response.CropSuggestionResponse;
import com.example.AgriConnect.service.CropRecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/crop")
@RequiredArgsConstructor
public class CropRecommendationController {

    private final CropRecommendationService service;

    @PostMapping("/suggest")
    public ResponseEntity<CropSuggestionResponse> suggest(
            @Valid @RequestBody CropSuggestionRequest request) {

        return ResponseEntity.ok(service.suggestCrop(request));
    }
}