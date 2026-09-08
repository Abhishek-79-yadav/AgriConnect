package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CropHistoryResponse {

    private Long id;
    private String cropName;
    private double yield;
    private String season;
    private LocalDate date;
    private double sellingPricePerUnit;
    private double costPricePerUnit;
    private double quantity;

    private String fertilizerUsed;
    private Double fertilizerQuantityKg;
    private String pesticideUsed;
    private Double pesticideQuantityL;

    // Computed for the farmer, not stored: (sellingPrice - costPrice) * quantity
    private double profit;
}
