package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.ChangePasswordRequest;
import com.example.AgriConnect.dto.request.UpdateProfileRequest;
import com.example.AgriConnect.dto.response.UserResponse;
import com.example.AgriConnect.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication auth) {

        return ResponseEntity.ok(
                userService.updateProfile(auth.getName(), request)
        );
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication auth) {

        userService.changePassword(auth.getName(), request);
        return ResponseEntity.noContent().build();
    }

    // Self-service deactivation — reversible by logging back in.
    @PutMapping("/deactivate")
    public ResponseEntity<Void> deactivateAccount(Authentication auth) {
        userService.deactivateAccount(auth.getName());
        return ResponseEntity.noContent().build();
    }

    // Self-service deletion — NOT reversible. Requires the current
    // password as confirmation, same as any other destructive account action.
    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteAccount(
            @Valid @RequestBody com.example.AgriConnect.dto.request.DeleteAccountRequest request,
            Authentication auth) {

        userService.deleteAccount(auth.getName(), request);
        return ResponseEntity.noContent().build();
    }
}
