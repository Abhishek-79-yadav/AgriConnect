package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.WarehouseLicense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WarehouseLicenseRepository extends JpaRepository<WarehouseLicense, Long> {
    List<WarehouseLicense> findByFarmer_IdOrderByAppliedAtDesc(Long farmerId);
    List<WarehouseLicense> findAllByOrderByAppliedAtDesc();
    long countByStatus(com.example.AgriConnect.entity.LicenseStatus status);
}
