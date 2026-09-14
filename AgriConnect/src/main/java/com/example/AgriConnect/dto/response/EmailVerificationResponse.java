package com.example.AgriConnect.dto.response;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
public class EmailVerificationResponse {

    private String message;

}
