package com.example.AgriConnect.dto.request;

import lombok.Data;

import java.time.LocalDate;

// Used by a farmer to attach/update carrier + tracking info on an order
// they're fulfilling. All fields optional so it can be called again later
// to correct a typo'd tracking number without resending everything.
@Data
public class ShipmentUpdateRequest {
    private String carrier;
    private String trackingNumber;
    private String trackingUrl;
    private LocalDate expectedDeliveryDate;
}
