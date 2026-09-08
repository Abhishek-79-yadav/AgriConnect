package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.FarmerProfileRequest;
import com.example.AgriConnect.dto.response.FarmerProfileResponse;
import com.example.AgriConnect.dto.response.UserResponse;
import com.example.AgriConnect.service.FarmerProfileService;
import com.example.AgriConnect.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmer")
@RequiredArgsConstructor
public class FarmerController {

    private final UserService userService;
    private final FarmerProfileService farmerProfileService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> profile(Authentication auth) {
        return ResponseEntity.ok(
                userService.getProfile(auth.getName())
        );
    }

    // Farm-specific details (soil type, location, land size) — separate
    // from /profile above, which is just basic account info (name/email).
    @GetMapping("/farm-profile")
    public ResponseEntity<FarmerProfileResponse> getFarmProfile(Authentication auth) {
        return ResponseEntity.ok(farmerProfileService.getMyProfile(auth.getName()));
    }

    @PutMapping("/farm-profile")
    public ResponseEntity<FarmerProfileResponse> updateFarmProfile(
            @RequestBody @Valid FarmerProfileRequest request, Authentication auth) {
        return ResponseEntity.ok(farmerProfileService.updateMyProfile(request, auth.getName()));
    }
}