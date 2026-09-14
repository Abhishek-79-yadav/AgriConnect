package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.*;
import com.example.AgriConnect.validation.StrongPassword;
import lombok.Data;

@Data
public class RegisterBrandRequest {

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

    @NotBlank
    private String companyName;

    private String gstNumber;
    private String category;

    private String city;
    private String state;
}
