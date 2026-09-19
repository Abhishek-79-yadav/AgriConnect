package com.example.AgriConnect.dto.request;

import lombok.Data;

import java.time.LocalDate;

// Used by a farmer (or admin) to open a shipment for a CONFIRMED order —
// the entry point into the proper logistics module. Carrier/tracking are
// optional here since some farmers hand off to a courier only after
// pickup; they can be added later via a shipment event.
@Data
public class CreateShipmentRequest {
    private String carrier;
    private String trackingNumber;
    private String trackingUrl;
    private String deliveryAgentName;
    private String deliveryAgentPhone;
    private String vehicleNumber;
    private LocalDate expectedDeliveryDate;
}
