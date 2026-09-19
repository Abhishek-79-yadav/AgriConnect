package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class OfferResponse {

    private Long id;
    private Long productId;
    private String productName;
    private BigDecimal listedPrice;

    private Long buyerId;
    private String buyerName;
    private Long farmerId;
    private String farmerName;

    private Double quantity;
    private BigDecimal offeredPrice;
    private String message;

    private String status;

    private BigDecimal counterPrice;
    private String counterMessage;

    private Long convertedOrderId;

    private LocalDateTime respondedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
