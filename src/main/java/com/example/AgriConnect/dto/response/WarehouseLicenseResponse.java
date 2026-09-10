package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class WarehouseLicenseResponse {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String warehouseName;
    private String location;
    private Double capacityTonnes;
    private String licenseNumber;
    private String documentUrl;
    private String status;
    private String remarks;
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private LocalDate expiryDate;
    private String reviewedByName;
}
