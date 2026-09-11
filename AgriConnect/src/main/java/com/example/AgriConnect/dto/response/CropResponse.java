package com.example.AgriConnect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CropResponse {

    private Long id;
    private String name;
    private String season;   // 🔴 MUST EXIST
    private String description;
}