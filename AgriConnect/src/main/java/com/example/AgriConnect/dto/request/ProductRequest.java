package com.example.AgriConnect.dto.request;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    private String productName;
    private BigDecimal price;
    private Double quantity;  // ✅ double to avoid Integer/Double mismatch
    private Long cropId;
    private String category;
    private String description;
    private String unit;
    private String city;
    private String state;
    private String country;
    private String imageUrl;
    private String videoUrl;
    private String governmentInfo;
}