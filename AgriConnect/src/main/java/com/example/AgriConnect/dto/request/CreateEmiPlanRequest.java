package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class CreateEmiPlanRequest {

    @Min(2)
    @Max(12)
    private Integer numberOfInstallments;
}
