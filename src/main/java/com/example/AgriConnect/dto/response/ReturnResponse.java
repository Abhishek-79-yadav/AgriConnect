package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReturnResponse {
    private Long id;
    private Long orderId;
    private Long orderItemId;
    private String productName;
    private String buyerName;
    private String reason;
    private String status;
    private String adminNote;
    private LocalDateTime requestedAt;
    private LocalDateTime resolvedAt;
}
