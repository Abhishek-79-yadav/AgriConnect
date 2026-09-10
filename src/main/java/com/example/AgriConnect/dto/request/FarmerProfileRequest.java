package com.example.AgriConnect.dto.request;

import lombok.Data;

@Data
public class FarmerProfileRequest {

    private String soilType;
    private String state;
    private String city;
    private Double landSizeAcres;
}
