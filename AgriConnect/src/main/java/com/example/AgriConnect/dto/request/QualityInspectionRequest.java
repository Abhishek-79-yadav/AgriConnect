package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

// Submitted by a GOVERNMENT (or ADMIN) inspector against a pending
// warehouse receipt. passed=true issues the receipt with the given
// grade; passed=false rejects it outright.
@Data
public class QualityInspectionRequest {

    @NotNull(message = "grade is required")
    private String grade;

    private Double moisturePercent;
    private Double foreignMatterPercent;

    @NotNull(message = "passed is required")
    private Boolean passed;

    private String remarks;
}
