package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaxRecordRequest {

    @NotNull(message = "userId is required")
    private Long userId;

    @NotBlank(message = "Period is required")
    private String period;

    @NotNull
    @Positive(message = "Taxable amount must be positive")
    private Double taxableAmount;

    @NotNull
    @Positive(message = "Tax amount must be positive")
    private Double taxAmount;

    private String taxType;

    private LocalDate dueDate;

    private String remarks;
}
