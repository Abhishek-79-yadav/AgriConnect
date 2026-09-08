package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.jetbrains.annotations.NotNull;

@Data
public class OrderRequest {

    @NotNull
    private Long productId;

    @Min(1)
    private int quantity;

    @NotBlank
    private String unit;
}