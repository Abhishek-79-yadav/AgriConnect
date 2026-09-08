package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ShipmentResponse {

    private Long id;
    private Long orderId;
    private String status;

    private String carrier;
    private String trackingNumber;
    private String trackingUrl;

    private String deliveryAgentName;
    private String deliveryAgentPhone;
    private String vehicleNumber;

    private LocalDate expectedDeliveryDate;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    private int deliveryAttempts;
    private String proofOfDeliveryName;
    private String proofOfDeliveryNote;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<ShipmentEventResponse> events;

    @Data
    @Builder
    public static class ShipmentEventResponse {
        private Long id;
        private String status;
        private String location;
        private String note;
        private LocalDateTime createdAt;
    }
}
