package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.FarmerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FarmerProfileRepository extends JpaRepository<FarmerProfile, Long> {

    Optional<FarmerProfile> findByFarmerId(Long farmerId);
}