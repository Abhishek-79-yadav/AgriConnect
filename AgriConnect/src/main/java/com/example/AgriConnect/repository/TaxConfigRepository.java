package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.TaxConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaxConfigRepository extends JpaRepository<TaxConfig, Long> {
    List<TaxConfig> findAllByOrderByCreatedAtDesc();
    List<TaxConfig> findByActiveTrueOrderByCreatedAtDesc();
}
