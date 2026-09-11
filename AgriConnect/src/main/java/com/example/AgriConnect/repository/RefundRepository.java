package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Refund;
import com.example.AgriConnect.entity.RefundStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RefundRepository extends JpaRepository<Refund, Long> {
    List<Refund> findByBuyer_IdOrderByCreatedAtDesc(Long buyerId);
    List<Refund> findByBuyer_IdAndStatus(Long buyerId, RefundStatus status);
}
