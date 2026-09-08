package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SchemeRequest {

    @NotBlank
    private String title;

    private String description;

    private String state;

    private String category;

    private String applyLink;

    private Long departmentId;

    private String eligibilityCriteria;
}