package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EmiPlanResponse {
    private Long id;
    private Long orderId;
    private Double totalAmount;
    private Integer numberOfInstallments;
    private LocalDateTime createdAt;
    private List<EmiInstallmentResponse> installments;
}
