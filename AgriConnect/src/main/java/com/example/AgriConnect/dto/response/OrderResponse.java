package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private Long id;
    private String status;
    private boolean paid;
    private double totalPrice;
    private String buyerName;
    private String paymentId;
    private String paymentMethod;
    private String invoiceUrl;
    private String couponCode;
    private Double discount;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    private String deliveryName;
    private String deliveryPhone;
    private String deliveryAddressLine;
    private String deliveryCity;
    private String deliveryState;
    private String deliveryPincode;

    // Shipment tracking
    private String carrier;
    private String trackingNumber;
    private String trackingUrl;
    private java.time.LocalDate expectedDeliveryDate;
    private LocalDateTime deliveredAt;

    // Delivery timeline — full status history, oldest first.
    private List<OrderStatusHistoryResponse> statusHistory;

    @Data
    @Builder
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private Double quantity;
        private Double price;
    }

    @Data
    @Builder
    public static class OrderStatusHistoryResponse {
        private String status;
        private String note;
        private LocalDateTime createdAt;
    }
}