package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CropInfoResponse {

    private Long id;

    private Long cropId;
    private String cropName;

    private String title;
    private String description;
    private String videoUrl;
}