package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.CropResponse;
import com.example.AgriConnect.service.CropService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropController {

    private final CropService cropService;

    // GET ALL CROPS
    @GetMapping
    public ResponseEntity<List<CropResponse>> getAllCrops() {
        return ResponseEntity.ok(cropService.getAllCrops());
    }

    // ✅ ADD THIS: CREATE CROP
    @PostMapping
    public ResponseEntity<CropResponse> createCrop(@RequestBody CropResponse request) {
        return ResponseEntity.ok(cropService.createCrop(request));
    }
}