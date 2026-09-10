package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class EmiInstallmentResponse {
    private Long id;
    private Integer installmentNumber;
    private Double amount;
    private LocalDate dueDate;
    private String status;
    private LocalDateTime paidAt;
}
