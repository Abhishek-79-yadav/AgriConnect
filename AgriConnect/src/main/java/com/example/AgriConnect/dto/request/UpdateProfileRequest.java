package com.example.AgriConnect.dto.request;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String name;
    private String mobile;
    private String address;
    private String city;
    private String state;
}
