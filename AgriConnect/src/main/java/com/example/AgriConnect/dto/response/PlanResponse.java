package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlanResponse {
    private Long id;
    private String name;
    private String tier;
    private double price;
    private int durationDays;
    private String description;
}
