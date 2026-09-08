package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CropRepository extends JpaRepository<Crop, Long> {
}