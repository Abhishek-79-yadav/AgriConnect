package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.UserResponse;
import com.example.AgriConnect.entity.BrandProfile;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.BrandProfileRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/brand")
@RequiredArgsConstructor
public class BrandController {

    private final UserRepository userRepo;
    private final BrandProfileRepository brandProfileRepo;

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> profile(Authentication auth) {

        User user = userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new ApiException("User not found"));

        BrandProfile profile = brandProfileRepo.findByUserId(user.getId())
                .orElseThrow(() -> new ApiException("Brand profile not found"));

        return ResponseEntity.ok(Map.of(
                "name", user.getName(),
                "email", user.getEmail(),
                "mobile", user.getMobile() != null ? user.getMobile() : "",
                "companyName", profile.getCompanyName(),
                "gstNumber", profile.getGstNumber() != null ? profile.getGstNumber() : "",
                "category", profile.getCategory() != null ? profile.getCategory() : ""
        ));
    }

    // Placeholder for now — product listing (Phase 2) and usage analytics
    // (Phase 3) will populate this with real numbers.
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        return ResponseEntity.ok(Map.of(
                "message", "Welcome to your AgriConnect company dashboard. Product listings and analytics are coming soon."
        ));
    }
}
