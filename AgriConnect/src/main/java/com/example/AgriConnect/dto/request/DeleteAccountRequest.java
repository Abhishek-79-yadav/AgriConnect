package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Password confirmation before a destructive, irreversible action —
// same reasoning as requiring the current password for ChangePasswordRequest.
@Data
public class DeleteAccountRequest {

    @NotBlank(message = "Password is required to confirm account deletion")
    private String password;
}
