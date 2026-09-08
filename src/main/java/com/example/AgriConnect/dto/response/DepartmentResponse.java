package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentResponse {
    private Long id;
    private String name;
    private String description;
    private boolean active;
}
