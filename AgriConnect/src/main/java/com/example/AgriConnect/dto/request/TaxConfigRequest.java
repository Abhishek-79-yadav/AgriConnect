package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaxConfigRequest {
    @NotBlank(message = "Tax type is required")
    private String taxType;

    private String category;

    @NotNull
    @PositiveOrZero(message = "Rate must be zero or positive")
    private Double ratePercent;

    private String description;

    private LocalDate effectiveFrom;
}
