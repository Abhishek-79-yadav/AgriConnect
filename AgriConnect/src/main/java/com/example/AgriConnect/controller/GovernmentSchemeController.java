package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.SchemeRequest;
import com.example.AgriConnect.dto.response.ApiResponse;
import com.example.AgriConnect.dto.response.SchemeResponse;
import com.example.AgriConnect.service.GovernmentSchemeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
@RequiredArgsConstructor
public class GovernmentSchemeController {

    private final GovernmentSchemeService service;

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<SchemeResponse>> add(
            @Valid @RequestBody SchemeRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success("Scheme added", service.addScheme(request))
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchemeResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success("Schemes fetched", service.getAllSchemes())
        );
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<ApiResponse<List<SchemeResponse>>> getByState(@PathVariable String state) {
        return ResponseEntity.ok(
                ApiResponse.success("Schemes fetched by state", service.getByState(state))
        );
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<List<SchemeResponse>>> getAllForManagement() {
        return ResponseEntity.ok(
                ApiResponse.success("Schemes fetched", service.getAllForManagement())
        );
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<SchemeResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody SchemeRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success("Scheme updated", service.updateScheme(id, request))
        );
    }

    @PutMapping("/admin/{id}/reactivate")
    public ResponseEntity<ApiResponse<Void>> reactivate(@PathVariable Long id) {

        service.reactivate(id);

        return ResponseEntity.ok(
                ApiResponse.success("Scheme reactivated", null)
        );
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {

        service.deactivate(id);

        return ResponseEntity.ok(
                ApiResponse.success("Scheme deactivated", null)
        );
    }
}