package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.CounterOfferRequest;
import com.example.AgriConnect.dto.request.CreateOfferRequest;
import com.example.AgriConnect.dto.request.OfferCheckoutRequest;
import com.example.AgriConnect.dto.response.OfferResponse;
import com.example.AgriConnect.service.OfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    // Buyer proposes a price/quantity on a product.
    @PostMapping
    public ResponseEntity<OfferResponse> createOffer(
            @RequestBody @Valid CreateOfferRequest request,
            Authentication auth) {
        return ResponseEntity.ok(offerService.createOffer(request, auth.getName()));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<OfferResponse>> getMine(Authentication auth) {
        return ResponseEntity.ok(offerService.getMine(auth.getName()));
    }

    @GetMapping("/farmer")
    public ResponseEntity<List<OfferResponse>> getForFarmer(Authentication auth) {
        return ResponseEntity.ok(offerService.getForFarmer(auth.getName()));
    }

    // Farmer accepts the buyer's original offer as-is.
    @PutMapping("/{id}/accept")
    public ResponseEntity<OfferResponse> accept(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(offerService.accept(id, auth.getName()));
    }

    // Farmer rejects the offer.
    @PutMapping("/{id}/reject")
    public ResponseEntity<OfferResponse> reject(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(offerService.reject(id, auth.getName()));
    }

    // Farmer counters with a different price.
    @PutMapping("/{id}/counter")
    public ResponseEntity<OfferResponse> counter(
            @PathVariable Long id,
            @RequestBody @Valid CounterOfferRequest request,
            Authentication auth) {
        return ResponseEntity.ok(offerService.counter(id, request, auth.getName()));
    }

    // Buyer accepts the farmer's counter-offer.
    @PutMapping("/{id}/accept-counter")
    public ResponseEntity<OfferResponse> acceptCounter(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(offerService.acceptCounter(id, auth.getName()));
    }

    // Buyer withdraws an offer that's still pending or countered.
    @PutMapping("/{id}/withdraw")
    public ResponseEntity<OfferResponse> withdraw(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(offerService.withdraw(id, auth.getName()));
    }

    // Buyer converts an ACCEPTED offer into a real order at the agreed price.
    @PostMapping("/{id}/checkout")
    public ResponseEntity<OfferResponse> checkout(
            @PathVariable Long id,
            @RequestBody @Valid OfferCheckoutRequest request,
            Authentication auth) {
        return ResponseEntity.ok(offerService.checkout(id, request, auth.getName()));
    }
}
