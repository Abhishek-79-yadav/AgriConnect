package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateContractRequest {

    @NotNull(message = "farmerId is required")
    private Long farmerId;

    @NotNull(message = "cropId is required")
    private Long cropId;

    @NotNull(message = "quantity is required")
    @DecimalMin(value = "0.01", message = "quantity must be greater than 0")
    private Double quantity;

    @NotNull(message = "unit is required")
    private String unit;

    @NotNull(message = "agreedPrice is required")
    @DecimalMin(value = "0.01", message = "agreedPrice must be greater than 0")
    private BigDecimal agreedPrice;

    // Optional — upfront payment offered to the farmer.
    private BigDecimal advancePayment;

    @NotNull(message = "deliveryDate is required")
    private LocalDate deliveryDate;

    private String terms;
}
