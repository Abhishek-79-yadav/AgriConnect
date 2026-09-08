package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CropHistoryRequest {

    @NotBlank
    private String cropName;

    @PositiveOrZero
    private double yield;

    private String season;

    @PastOrPresent
    private LocalDate date;

    @PositiveOrZero
    private double sellingPricePerUnit;

    @PositiveOrZero
    private double costPricePerUnit;

    @PositiveOrZero
    private double quantity;

    // Optional — not every crop cycle involves either.
    private String fertilizerUsed;

    @PositiveOrZero
    private Double fertilizerQuantityKg;

    private String pesticideUsed;

    @PositiveOrZero
    private Double pesticideQuantityL;
}
