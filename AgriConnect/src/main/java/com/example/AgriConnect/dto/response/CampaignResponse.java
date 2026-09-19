package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CampaignResponse {
    private Long id;
    private String name;
    private String description;
    private String type;
    private String status;
    private String bannerImageUrl;
    private String linkUrl;
    private String couponCode;
    private String targetRole;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long impressions;
    private Long clicks;
    private LocalDateTime createdAt;
}
