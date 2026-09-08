package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.CropHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CropHistoryRepository extends JpaRepository<CropHistory, Long> {

    List<CropHistory> findByFarmerId(Long farmerId);
}