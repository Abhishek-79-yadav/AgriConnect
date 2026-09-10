package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FarmerDashboardResponse {

    private long totalCrops;

    private String bestCrop;

    private String worstCrop;

    private double totalYield;

    private double estimatedProfit;
}