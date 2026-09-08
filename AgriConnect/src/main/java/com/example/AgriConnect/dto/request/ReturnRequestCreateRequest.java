package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReturnRequestCreateRequest {

    @NotNull
    private Long orderId;

    // Optional — omit to request a return for the whole order.
    private Long orderItemId;

    @NotBlank
    private String reason;
}
