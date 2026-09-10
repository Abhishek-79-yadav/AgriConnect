package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.CouponRequest;
import com.example.AgriConnect.dto.response.CouponResponse;
import com.example.AgriConnect.entity.Coupon;
import com.example.AgriConnect.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupon")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping
    public Coupon createCoupon(
            @RequestBody CouponRequest request) {

        return couponService.createCoupon(request);
    }

    @PostMapping("/apply")
    public CouponResponse applyCoupon(
            @RequestParam String code,
            @RequestParam Double amount) {

        return couponService.applyCoupon(code, amount);
    }

    @GetMapping("/validate/{code}")
    public boolean validateCoupon(
            @PathVariable String code) {

        return couponService.validateCoupon(code);
    }
}