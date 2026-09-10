package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.OrderResponse;
import com.example.AgriConnect.dto.response.PhonePeInitiateResponse;
import com.example.AgriConnect.dto.response.RazorpayOrderResponse;
import com.example.AgriConnect.service.PaymentService;
import com.example.AgriConnect.service.PhonePeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buyer/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PhonePeService phonePeService;

    @PostMapping("/create/{orderId}")
    public ResponseEntity<RazorpayOrderResponse> createOrder(@PathVariable Long orderId,
                                         Authentication authentication) {

        return ResponseEntity.ok(
                paymentService.createRazorpayOrder(orderId, authentication.getName())
        );
    }

    @PostMapping("/verify/{orderId}")
    public ResponseEntity<OrderResponse> verifyPayment(
            @PathVariable Long orderId,
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpaySignature,
            Authentication authentication) {

        return ResponseEntity.ok(
                paymentService.verifyPayment(
                        orderId,
                        authentication.getName(),
                        razorpayOrderId,
                        razorpayPaymentId,
                        razorpaySignature)
        );
    }

    // ==================== PHONEPE ====================

    @PostMapping("/phonepe/initiate/{orderId}")
    public ResponseEntity<PhonePeInitiateResponse> initiatePhonePe(
            @PathVariable Long orderId,
            Authentication authentication) {

        return ResponseEntity.ok(
                phonePeService.initiatePayment(orderId, authentication.getName())
        );
    }

    // PhonePe calls this server-to-server once payment settles — no auth
    // header will be present (it's PhonePe hitting us, not the browser),
    // so this endpoint is intentionally public and relies on the X-VERIFY
    // checksum for authenticity instead. Must stay in the public allow-list
    // in SecurityConfig.
    @PostMapping("/phonepe/callback")
    public ResponseEntity<Void> phonePeCallback(
            @RequestBody java.util.Map<String, String> body,
            @RequestHeader("X-VERIFY") String xVerify) {

        phonePeService.handleCallback(body.get("response"), xVerify);
        return ResponseEntity.ok().build();
    }

    // Called by the frontend right after the buyer is redirected back from
    // PhonePe, so the UI can show a confirmed result without waiting on the
    // async server-to-server callback above.
    @GetMapping("/phonepe/confirm/{merchantTransactionId}")
    public ResponseEntity<OrderResponse> confirmPhonePe(
            @PathVariable String merchantTransactionId) {

        return ResponseEntity.ok(
                phonePeService.confirmPayment(merchantTransactionId)
        );
    }
}