package com.example.AgriConnect.dto.response;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchResponse {

    private Long id;

    private String productName;

    private Double price;

    private String imageUrl;

    private String farmerName;

}
