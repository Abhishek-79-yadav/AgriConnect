package com.example.AgriConnect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RiskFlagResponse {
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String flagReason;
    private long metricValue;
}
