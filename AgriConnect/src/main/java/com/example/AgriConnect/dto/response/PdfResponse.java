package com.example.AgriConnect.dto.response;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
public class PdfResponse {

    private String fileName;

    private String downloadUrl;

}
