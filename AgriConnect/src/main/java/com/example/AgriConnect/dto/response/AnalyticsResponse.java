package com.example.AgriConnect.dto.response;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnalyticsResponse {

    private long totalUsers;

    private long totalFarmers;

    private long totalBuyers;

    private long totalOrders;

    private double totalRevenue;

}
