package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.CropInfoResponse;
import com.example.AgriConnect.service.CropInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crop-info")
@RequiredArgsConstructor
public class CropInfoController {

    private final CropInfoService cropInfoService;

    @GetMapping("/{cropId}")
    public ResponseEntity<List<CropInfoResponse>> getInfo(@PathVariable Long cropId) {
        return ResponseEntity.ok(
                cropInfoService.getByCropId(cropId)
        );
    }
}