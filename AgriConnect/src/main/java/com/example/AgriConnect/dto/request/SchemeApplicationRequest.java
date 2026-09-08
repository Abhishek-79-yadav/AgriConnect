package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SchemeApplicationRequest {
    @NotNull(message = "schemeId is required")
    private Long schemeId;
    private String documentUrl;
}
