package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.QualityInspection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QualityInspectionRepository extends JpaRepository<QualityInspection, Long> {

    List<QualityInspection> findByWarehouseReceipt_IdOrderByInspectedAtDesc(Long warehouseReceiptId);
}
