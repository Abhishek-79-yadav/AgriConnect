package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.WarehouseReceipt;
import com.example.AgriConnect.entity.WarehouseReceiptStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WarehouseReceiptRepository extends JpaRepository<WarehouseReceipt, Long> {

    List<WarehouseReceipt> findByFarmer_IdOrderByStoredAtDesc(Long farmerId);

    List<WarehouseReceipt> findByStatusOrderByStoredAtAsc(WarehouseReceiptStatus status);
}
