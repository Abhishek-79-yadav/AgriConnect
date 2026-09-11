package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.CouponRequest;
import com.example.AgriConnect.dto.response.CouponResponse;
import com.example.AgriConnect.entity.Coupon;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    // CREATE COUPON
    public Coupon createCoupon(CouponRequest request) {

        if (couponRepository.findByCode(request.getCode()).isPresent()) {
            throw new ApiException("Coupon already exists");
        }

        Coupon coupon = Coupon.builder()
                .code(request.getCode())
                .discount(request.getDiscount())
                .expiryDate(request.getExpiryDate())
                .active(true)
                .build();

        return couponRepository.save(coupon);
    }

    // APPLY COUPON
    public CouponResponse applyCoupon(String code, Double amount) {

        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() ->
                        new ApiException("Coupon not found"));

        if (!coupon.isActive()) {
            throw new ApiException("Coupon inactive");
        }

        if (coupon.getExpiryDate().isBefore(LocalDate.now())) {
            throw new ApiException("Coupon expired");
        }

        double discountAmount =
                amount * coupon.getDiscount() / 100;

        double finalAmount =
                amount - discountAmount;

        return CouponResponse.builder()
                .code(code)
                .discount(coupon.getDiscount())
                .originalAmount(amount)
                .finalAmount(finalAmount)
                .message("Coupon applied successfully")
                .build();
    }

    // VALIDATE
    public boolean validateCoupon(String code) {

        return couponRepository.findByCode(code)
                .filter(Coupon::isActive)
                .filter(c ->
                        !c.getExpiryDate().isBefore(LocalDate.now()))
                .isPresent();
    }
}