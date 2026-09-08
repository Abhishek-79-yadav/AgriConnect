package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DisputeRequest {

    @NotNull
    private Long orderId;

    @NotBlank
    private String reason;

    private String description;
}
