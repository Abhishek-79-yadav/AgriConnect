package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.ForgotPasswordRequest;
import com.example.AgriConnect.dto.request.LoginRequest;
import com.example.AgriConnect.dto.request.LogoutRequest;
import com.example.AgriConnect.dto.request.RefreshTokenRequest;
import com.example.AgriConnect.dto.request.RegisterRequest;
import com.example.AgriConnect.dto.request.RegisterBrandRequest;
import com.example.AgriConnect.dto.request.CreateAdminRequest;
import com.example.AgriConnect.dto.request.BootstrapSuperAdminRequest;
import com.example.AgriConnect.dto.request.ResetPasswordRequest;
import com.example.AgriConnect.dto.response.ApiResponse;
import com.example.AgriConnect.dto.response.AuthResponse;
import com.example.AgriConnect.dto.response.UserResponse;
import com.example.AgriConnect.service.AuthService;
import com.example.AgriConnect.service.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(authService.register(request));
    }

    // Company/BRAND signup — separate from /register since it takes extra
    // fields (company name, GST) and doesn't log the user in immediately;
    // the account sits pending until an admin approves it.
    @PostMapping("/register-brand")
    public ResponseEntity<String> registerBrand(
            @Valid @RequestBody RegisterBrandRequest request) {

        authService.registerBrand(request);
        return ResponseEntity.ok("Registration received — you can log in once an admin approves your account.");
    }

    // One-time setup — see AuthService.bootstrapSuperAdmin for the guard
    // conditions. Not meant to be linked from any UI; call it directly once
    // during initial deployment.
    @PostMapping("/bootstrap-super-admin")
    public ResponseEntity<String> bootstrapSuperAdmin(
            @Valid @RequestBody BootstrapSuperAdminRequest request) {

        authService.bootstrapSuperAdmin(request);
        return ResponseEntity.ok("Super admin created. You can log in now.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request.getEmail());

        return ResponseEntity.ok("If that email is registered, we've sent a reset code.");
    }

    // Public — the token itself is the credential (see EmailVerificationToken).
    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        emailVerificationService.verify(token);
        return ResponseEntity.ok("Email verified.");
    }

    // Authenticated — resends to the caller's own email, not an arbitrary one.
    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(Authentication auth) {
        emailVerificationService.resendVerification(auth.getName());
        return ResponseEntity.ok("Verification email sent.");
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> profile(Authentication authentication) {

        return ResponseEntity.ok(
                authService.getProfile(authentication.getName())
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );

        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {

        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest httpRequest,
            @RequestBody(required = false) LogoutRequest request) {

        String authHeader = httpRequest.getHeader("Authorization");
        String accessToken = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7)
                : null;

        String refreshToken = request != null ? request.getRefreshToken() : null;

        authService.logout(accessToken, refreshToken);

        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }
}