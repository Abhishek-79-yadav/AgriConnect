package com.example.AgriConnect.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Double price;
    private Double quantity;   // ✅ double
    private Double totalPrice;
}