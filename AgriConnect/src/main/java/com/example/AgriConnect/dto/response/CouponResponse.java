package com.example.AgriConnect.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponResponse {

    private String code;

    private Double discount;

    private Double originalAmount;

    private Double finalAmount;

    private String message;
}