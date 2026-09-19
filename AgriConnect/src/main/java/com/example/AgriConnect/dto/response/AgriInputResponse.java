package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AgriInputResponse {
    private Long id;
    private String name;
    private String description;
    private String category;
    private double price;
    private double stock;
    private String unit;
    private String imageUrl;
    private String companyName;
    private Long companyId;
    private boolean approved;
}
