package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Long orderItemId;
    private Long buyerId;
    private String buyerName;
    private Integer rating;
    private String comment;
    private String farmerReply;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
