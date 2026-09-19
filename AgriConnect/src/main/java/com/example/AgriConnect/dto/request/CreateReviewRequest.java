package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateReviewRequest {

    @NotNull
    private Long orderItemId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    private String comment;
}
