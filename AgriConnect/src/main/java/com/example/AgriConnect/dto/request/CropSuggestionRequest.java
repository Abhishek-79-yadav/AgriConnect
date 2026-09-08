package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
public class CropSuggestionRequest {

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String soilType;

    @Min(value = -50)
    @Max(value = 60)
    private double temperature;

    @Min(0)
    @Max(100)
    private int humidity;
}