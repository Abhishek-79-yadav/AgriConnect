package com.example.AgriConnect.dto.response;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImageUploadResponse {

    private String imageUrl;

    private String publicId;

}
