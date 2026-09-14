package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.BrandProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BrandProfileRepository extends JpaRepository<BrandProfile, Long> {
    Optional<BrandProfile> findByUserId(Long userId);
}
