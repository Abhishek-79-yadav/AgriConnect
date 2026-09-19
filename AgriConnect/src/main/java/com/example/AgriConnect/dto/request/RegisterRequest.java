package com.example.AgriConnect.dto.request;

import com.example.AgriConnect.entity.Role;
import com.example.AgriConnect.validation.StrongPassword;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    private String city;
    private String state;

    @NotBlank
    @Size(min = 3, max = 50)
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    @StrongPassword
    private String password;

    @Pattern(regexp = "^[6-9]\\d{9}$")
    private String mobile;

    // Only FARMER / BUYER can be chosen by the person registering themselves.
    // ADMIN and BRAND must never be settable from this public endpoint —
    // AuthService enforces this again server-side, this annotation is just
    // the first line of defense.
    @NotNull(message = "Role is required")
    private Role role;
}