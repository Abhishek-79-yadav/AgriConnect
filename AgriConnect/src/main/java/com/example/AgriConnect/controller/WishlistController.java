package com.example.AgriConnect.controller;

import com.example.AgriConnect.entity.Wishlist;
import com.example.AgriConnect.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/{productId}")
    public String addWishlist(@PathVariable Long productId,
                              Authentication authentication) {

        return wishlistService.addToWishlist(
                productId,
                authentication.getName()
        );
    }

    @GetMapping
    public List<Wishlist> getWishlist(Authentication authentication) {

        return wishlistService.getWishlist(
                authentication.getName()
        );
    }

    @DeleteMapping("/{productId}")
    public String removeWishlist(@PathVariable Long productId,
                                 Authentication authentication) {

        return wishlistService.removeWishlist(
                productId,
                authentication.getName()
        );
    }
}