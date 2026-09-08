package com.example.AgriConnect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RatingResponse {

    private Long id;
    private int stars;
    private String comment;
    private String buyerName;
    private String farmerName;
}