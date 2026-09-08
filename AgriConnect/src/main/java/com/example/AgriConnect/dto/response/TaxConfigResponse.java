package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TaxConfigResponse {
    private Long id;
    private String taxType;
    private String category;
    private Double ratePercent;
    private String description;
    private boolean active;
    private LocalDate effectiveFrom;
    private LocalDateTime createdAt;
}
