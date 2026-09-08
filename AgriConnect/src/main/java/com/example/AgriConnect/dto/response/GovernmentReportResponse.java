package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GovernmentReportResponse {
    private long totalSchemes;
    private long activeSchemes;

    private long totalApplications;
    private long submittedApplications;
    private long underReviewApplications;
    private long approvedApplications;
    private long rejectedApplications;

    private long totalLicenses;
    private long pendingLicenses;
    private long activeLicenses;
    private long suspendedLicenses;
    private long cancelledLicenses;

    private long totalTaxRecords;
    private long pendingTaxRecords;
    private long paidTaxRecords;
    private long overdueTaxRecords;
    private double totalTaxCollected;
    private double totalTaxPending;

    private long activeNotices;
    private long activeDepartments;
}
