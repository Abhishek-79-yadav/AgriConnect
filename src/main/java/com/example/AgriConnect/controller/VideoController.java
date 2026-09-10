package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.ProductVideoResponse;
import com.example.AgriConnect.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @PostMapping("/upload")
    public ResponseEntity<ProductVideoResponse> upload(
            @RequestParam Long productId,
            @RequestParam String title,
            @RequestParam MultipartFile file,
            Authentication auth) {

        if (file.isEmpty() || !Objects.requireNonNull(file.getContentType()).startsWith("video/")) {
            throw new IllegalArgumentException("Invalid file");
        }

        return ResponseEntity.ok(
                videoService.uploadVideo(productId, title, file, auth.getName())
        );
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductVideoResponse>> getByProduct(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                videoService.getByProduct(productId)
        );
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<ProductVideoResponse>> getByFarmer(
            @PathVariable Long farmerId) {

        return ResponseEntity.ok(
                videoService.getByFarmer(farmerId)
        );
    }
}