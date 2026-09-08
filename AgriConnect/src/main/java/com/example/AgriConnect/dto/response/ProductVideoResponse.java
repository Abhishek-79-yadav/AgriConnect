package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductVideoResponse {

    private Long id;
    private String title;
    private String videoUrl;

    private Long productId;
    private String productName;

    private Long farmerId;
    private String farmerName;
}