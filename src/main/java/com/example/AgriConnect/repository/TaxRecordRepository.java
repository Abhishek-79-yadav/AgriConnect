package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.TaxRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaxRecordRepository extends JpaRepository<TaxRecord, Long> {
    List<TaxRecord> findByUser_IdOrderByCreatedAtDesc(Long userId);
    List<TaxRecord> findAllByOrderByCreatedAtDesc();
    long countByStatus(com.example.AgriConnect.entity.TaxRecordStatus status);
}
