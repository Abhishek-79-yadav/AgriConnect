package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateAdminRequest {

    @NotBlank
    @Size(min = 3, max = 50)
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 8)
    private String password;
}
