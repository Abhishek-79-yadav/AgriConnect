package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RatingRequest {

    @NotNull
    private Long farmerId;

    @Min(1)
    @Max(5)
    private int stars;

    @Size(max = 500)
    private String comment;
}