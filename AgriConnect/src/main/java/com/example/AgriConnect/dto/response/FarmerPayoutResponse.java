package com.example.AgriConnect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class FarmerPayoutResponse {

    private Long farmerId;
    private String farmerName;
    private String farmerEmail;

    // Sum of price*quantity across every paid order item for this farmer
    // that hasn't been marked as paid out yet.
    private double pendingAmount;

    // Sum across every paid order item that HAS been marked paid out.
    private double paidOutAmount;

    private List<OrderItemLine> pendingItems;

    @Data
    @Builder
    @AllArgsConstructor
    public static class OrderItemLine {
        private Long orderItemId;
        private Long orderId;
        private String productName;
        private Double quantity;
        private Double price;
        private double lineTotal;
    }
}
