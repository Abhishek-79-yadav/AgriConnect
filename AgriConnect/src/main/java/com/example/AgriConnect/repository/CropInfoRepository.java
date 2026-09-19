package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.CropInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CropInfoRepository extends JpaRepository<CropInfo, Long> {

    List<CropInfo> findByCropId(Long cropId);
}