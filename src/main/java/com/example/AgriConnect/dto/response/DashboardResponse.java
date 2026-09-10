package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {

    private String farmerName;
    private long totalProducts;
    private long totalOrders;
    private double totalRevenue;

    private long pendingOrders;
    private long acceptedOrders;
    private long shippedOrders;
    private long deliveredOrders;
}