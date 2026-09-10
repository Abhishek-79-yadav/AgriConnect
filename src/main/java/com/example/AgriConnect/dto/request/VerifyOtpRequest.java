package com.example.AgriConnect.dto.request;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.*;

@Data
public class VerifyOtpRequest {

    @Email
    private String email;

    @NotBlank
    private String otp;

}
