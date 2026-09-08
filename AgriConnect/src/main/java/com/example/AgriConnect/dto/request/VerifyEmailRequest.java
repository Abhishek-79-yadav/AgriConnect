package com.example.AgriConnect.dto.request;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
public class VerifyEmailRequest {

    @NotBlank
    private String token;

}
