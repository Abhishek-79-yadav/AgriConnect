package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TaxRecordResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userRole;
    private String period;
    private Double taxableAmount;
    private Double taxAmount;
    private String taxType;
    private String status;
    private LocalDate dueDate;
    private LocalDateTime paidAt;
    private String remarks;
    private LocalDateTime createdAt;
}
