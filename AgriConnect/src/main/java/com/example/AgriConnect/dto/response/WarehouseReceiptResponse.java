package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class WarehouseReceiptResponse {

    private Long id;
    private Long warehouseLicenseId;
    private String warehouseName;
    private String farmerName;
    private String cropName;
    private Double quantity;
    private String unit;
    private String status;
    private String receiptNumber;
    private String remarks;
    private LocalDateTime storedAt;
    private LocalDateTime updatedAt;

    private List<QualityInspectionResponse> inspections;

    @Data
    @Builder
    public static class QualityInspectionResponse {
        private Long id;
        private String inspectorName;
        private String grade;
        private Double moisturePercent;
        private Double foreignMatterPercent;
        private boolean passed;
        private String remarks;
        private LocalDateTime inspectedAt;
    }
}
