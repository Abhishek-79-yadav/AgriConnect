package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WalletTransactionResponse {
    private Long id;
    private String type;
    private Double amount;
    private String reason;
    private String referenceType;
    private Long referenceId;
    private Double balanceAfter;
    private LocalDateTime createdAt;
}
