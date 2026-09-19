package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.CropSuggestionResponse;
import com.example.AgriConnect.service.SmartAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class SmartAIController {

    private final SmartAIService service;

    @GetMapping("/recommend")
    public ResponseEntity<CropSuggestionResponse> recommend(
            @RequestParam Long farmerId,
            @RequestParam double temp,
            @RequestParam int humidity) {

        return ResponseEntity.ok(
                service.recommend(farmerId, temp, humidity)
        );
    }
}