package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetOtpRepository
        extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findByEmail(String email);

    Optional<PasswordResetOtp> findByEmailAndOtp(String email,String otp);

    void deleteByEmail(String email);
}