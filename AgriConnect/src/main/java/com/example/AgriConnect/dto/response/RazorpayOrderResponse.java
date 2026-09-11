package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RazorpayOrderResponse {
    private String razorpayOrderId;
    private long amount;      // in paise, as Razorpay's checkout.js expects
    private String currency;
    private String razorpayKey; // public key id, needed client-side to open the checkout modal
}
