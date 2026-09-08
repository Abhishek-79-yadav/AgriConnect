package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.CreateReviewRequest;
import com.example.AgriConnect.dto.request.UpdateReviewRequest;
import com.example.AgriConnect.dto.response.ReviewResponse;
import com.example.AgriConnect.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> create(
            @RequestBody @Valid CreateReviewRequest request,
            Authentication auth) {
        return ResponseEntity.ok(reviewService.create(auth.getName(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid UpdateReviewRequest request,
            Authentication auth) {
        return ResponseEntity.ok(reviewService.update(id, auth.getName(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        reviewService.delete(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    // Farmer replies to a review on their own product.
    @PutMapping("/{id}/reply")
    public ResponseEntity<ReviewResponse> reply(
            @PathVariable Long id,
            @RequestParam String reply,
            Authentication auth) {
        return ResponseEntity.ok(reviewService.reply(id, auth.getName(), reply));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getForProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getForProduct(productId));
    }

    @GetMapping("/buyer")
    public ResponseEntity<List<ReviewResponse>> getMine(Authentication auth) {
        return ResponseEntity.ok(reviewService.getMine(auth.getName()));
    }

    @GetMapping("/buyer/reviewable")
    public ResponseEntity<List<Long>> getReviewableOrderItemIds(Authentication auth) {
        return ResponseEntity.ok(reviewService.getReviewableOrderItemIds(auth.getName()));
    }

    @GetMapping("/farmer")
    public ResponseEntity<List<ReviewResponse>> getForFarmer(Authentication auth) {
        return ResponseEntity.ok(reviewService.getForFarmer(auth.getName()));
    }
}
