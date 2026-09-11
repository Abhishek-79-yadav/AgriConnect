package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FarmerProfileResponse {

    private String soilType;
    private String state;
    private String city;
    private Double landSizeAcres;
}
