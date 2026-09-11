package com.example.AgriConnect.mapper;

import com.example.AgriConnect.dto.response.CropResponse;
import com.example.AgriConnect.entity.Crop;
import org.springframework.stereotype.Component;

@Component
public class CropMapper {

    public CropResponse toResponse(Crop crop){

        return CropResponse.builder()
                .id(crop.getId())
                .name(crop.getName())
                .season(crop.getSeason())
                .description(crop.getDescription())
                .build();
    }
}