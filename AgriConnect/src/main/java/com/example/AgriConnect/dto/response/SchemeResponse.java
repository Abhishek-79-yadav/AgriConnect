package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SchemeResponse {

    private Long id;
    private String title;
    private String description;
    private String state;
    private String category;
    private String applyLink;
    private boolean active;
    private Long departmentId;
    private String departmentName;
    private String eligibilityCriteria;
}