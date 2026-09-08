package com.example.AgriConnect.dto.request;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponRequest {

    private String code;

    private Double discount;

    private LocalDate expiryDate;
}