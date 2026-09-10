package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ContractResponse {

    private Long id;

    private Long buyerId;
    private String buyerName;
    private Long farmerId;
    private String farmerName;

    private String cropName;
    private Double quantity;
    private String unit;
    private BigDecimal agreedPrice;
    private BigDecimal advancePayment;

    private LocalDate startDate;
    private LocalDate deliveryDate;
    private String terms;

    private String status;
    private Double deliveredQuantity;
    private Double remainingQuantity;

    private LocalDateTime respondedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<DeliveryResponse> deliveries;

    @Data
    @Builder
    public static class DeliveryResponse {
        private Long id;
        private Double quantity;
        private String note;
        private LocalDateTime deliveredAt;
    }
}
