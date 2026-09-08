package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WarehouseLicenseRequest {

    @NotBlank(message = "Warehouse name is required")
    private String warehouseName;

    private String location;

    private Double capacityTonnes;

    private String documentUrl;
}
