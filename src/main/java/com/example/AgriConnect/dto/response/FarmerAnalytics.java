package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FarmerAnalytics {

    private long totalProducts;
    private long totalOrders;
    private double totalRevenue;

    private long pendingOrders;
    private long confirmedOrders;
    private long shippedOrders;
    private long deliveredOrders;

    private double averageRating;
}