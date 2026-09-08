package com.example.AgriConnect.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;

    private String productName;

    private BigDecimal price;

    private Double quantity;

    private String unit;

    private String crop;

    private String category;

    private String city;

    private String state;

    private String farmerName;

    private Long farmerId;

    private String farmerEmail;

    private String imageUrl;

    private String videoUrl;

    private BigDecimal totalPrice;

    private boolean approved;
}