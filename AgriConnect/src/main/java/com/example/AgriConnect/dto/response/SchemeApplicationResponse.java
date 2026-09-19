package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SchemeApplicationResponse {
    private Long id;
    private Long schemeId;
    private String schemeTitle;
    private Long applicantId;
    private String applicantName;
    private String documentUrl;
    private String status;
    private boolean documentVerified;
    private String verificationRemarks;
    private String decisionRemarks;
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private String reviewedByName;
}
