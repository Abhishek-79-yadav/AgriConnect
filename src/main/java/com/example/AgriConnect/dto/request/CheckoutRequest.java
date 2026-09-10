package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CheckoutRequest {

    // "ONLINE" (Razorpay) or "COD". Defaults to ONLINE if not sent.
    private String paymentMethod = "ONLINE";

    @NotBlank(message = "Delivery name is required")
    private String deliveryName;

    @NotBlank(message = "Delivery phone is required")
    private String deliveryPhone;

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddressLine;

    @NotBlank(message = "Delivery city is required")
    private String deliveryCity;

    @NotBlank(message = "Delivery state is required")
    private String deliveryState;

    @NotBlank(message = "Delivery pincode is required")
    private String deliveryPincode;

    // Optional — validated and applied server-side in OrderService.checkout()
    private String couponCode;

    // Optional — when provided, only these cart rows are checked out
    // (buyer picked a subset via the cart's checkboxes). Omitted or
    // empty means "checkout the whole cart", same as before this existed.
    private java.util.List<Long> cartItemIds;
}
