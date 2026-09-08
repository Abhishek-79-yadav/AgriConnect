package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.RatingRequest;
import com.example.AgriConnect.dto.response.RatingResponse;
import com.example.AgriConnect.mapper.RatingMapper;
import com.example.AgriConnect.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/api/buyer/rate")
    public ResponseEntity<RatingResponse> rate(
            @Valid @RequestBody RatingRequest request,
            Authentication auth) {

        return ResponseEntity.ok(
                ratingService.rateFarmer(request, auth.getName())
        );
    }

    /** GET /api/farmer/{farmerId}/ratings — all ratings for a farmer */
    @GetMapping("/api/farmer/{farmerId}/ratings")
    public ResponseEntity<List<RatingResponse>> getFarmerRatings(@PathVariable Long farmerId) {

        List<RatingResponse> responses = ratingService.getFarmerRatings(farmerId)
                .stream()
                .map(RatingMapper::mapToResponse)
                .toList();

        return ResponseEntity.ok(responses);
    }

    /** GET /api/farmer/{farmerId}/rating-average */
    @GetMapping("/api/farmer/{farmerId}/rating-average")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Long farmerId) {

        double avg = ratingService.getAverageRating(farmerId);
        return ResponseEntity.ok(Map.of("farmerId", farmerId, "averageRating", avg));
    }
}
