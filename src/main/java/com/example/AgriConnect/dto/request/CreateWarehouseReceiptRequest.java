package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

// Farmer requests a receipt for produce stored at one of their own
// APPROVED warehouses. Starts PENDING_INSPECTION — a government/admin
// inspector must grade it before it's ISSUED.
@Data
public class CreateWarehouseReceiptRequest {

    @NotNull(message = "warehouseLicenseId is required")
    private Long warehouseLicenseId;

    @NotNull(message = "cropId is required")
    private Long cropId;

    @NotNull(message = "quantity is required")
    private Double quantity;

    @NotNull(message = "unit is required")
    private String unit;

    private String remarks;
}
