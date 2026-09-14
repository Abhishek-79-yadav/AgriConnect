package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CounterOfferRequest {

    @NotNull(message = "counterPrice is required")
    @DecimalMin(value = "0.01", message = "counterPrice must be greater than 0")
    private BigDecimal counterPrice;

    private String counterMessage;
}
