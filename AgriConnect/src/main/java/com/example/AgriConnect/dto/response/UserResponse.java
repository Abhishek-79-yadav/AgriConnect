package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String mobile;
    private String city;
    private String state;
    private String role;
    private boolean emailVerified;
}