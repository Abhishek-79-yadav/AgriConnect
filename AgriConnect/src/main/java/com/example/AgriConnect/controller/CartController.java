package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.CartResponse;
import com.example.AgriConnect.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buyer/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            @RequestParam Long productId,
            @RequestParam double qty,
            Authentication auth) {

        return ResponseEntity.ok(
                cartService.addToCart(productId, qty, auth.getName())
        );
    }

    @GetMapping
    public ResponseEntity<List<CartResponse>> getCart(Authentication auth) {

        return ResponseEntity.ok(
                cartService.getCart(auth.getName())
        );
    }

    @PutMapping
    public ResponseEntity<CartResponse> updateCart(
            @RequestParam Long productId,
            @RequestParam double qty,
            Authentication auth) {

        return ResponseEntity.ok(
                cartService.updateQuantity(productId, qty, auth.getName())
        );
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeCart(
            @PathVariable Long productId,
            Authentication auth) {

        cartService.removeFromCart(productId, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
