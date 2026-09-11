package com.example.AgriConnect.mapper;

import com.example.AgriConnect.dto.response.RatingResponse;
import com.example.AgriConnect.entity.Rating;

public class RatingMapper {

    public static RatingResponse mapToResponse(Rating r) {

        return RatingResponse.builder()
                .id(r.getId())
                .stars(r.getStars())
                .comment(r.getComment())
                .buyerName(r.getBuyer().getName())
                .farmerName(r.getFarmer().getName())
                .build();
    }
}