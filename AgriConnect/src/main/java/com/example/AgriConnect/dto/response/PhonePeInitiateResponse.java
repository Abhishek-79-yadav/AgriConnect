package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PhonePeInitiateResponse {
    private String merchantTransactionId;
    // The buyer's browser is redirected here (PhonePe's hosted payment page).
    // Unlike Razorpay's popup modal, there's nothing to render client-side —
    // the frontend just does window.location.href = redirectUrl.
    private String redirectUrl;
}
