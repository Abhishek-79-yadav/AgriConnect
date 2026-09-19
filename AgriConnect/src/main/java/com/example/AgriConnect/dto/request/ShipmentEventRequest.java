package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

// Adds one checkpoint to a shipment's timeline (e.g. "IN_TRANSIT" at
// "Nagpur sorting hub") and moves the shipment to that status. Use
// DeliveryAttemptRequest instead when recording a delivery attempt
// (success or failure), since that path also updates attempt counts and
// proof-of-delivery.
@Data
public class ShipmentEventRequest {

    @NotNull(message = "status is required")
    private String status;

    private String location;
    private String note;
}
