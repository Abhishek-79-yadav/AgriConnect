package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RefundResponse {
    private Long id;
    private Long orderId;
    private Long orderItemId;
    private String buyerName;
    private Double amount;
    private String reason;
    private String status;
    private String method;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
