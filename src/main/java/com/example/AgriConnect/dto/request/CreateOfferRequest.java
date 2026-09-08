package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateOfferRequest {

    @NotNull(message = "productId is required")
    private Long productId;

    @NotNull(message = "quantity is required")
    @DecimalMin(value = "0.01", message = "quantity must be greater than 0")
    private Double quantity;

    @NotNull(message = "offeredPrice is required")
    @DecimalMin(value = "0.01", message = "offeredPrice must be greater than 0")
    private java.math.BigDecimal offeredPrice;

    private String message;
}
