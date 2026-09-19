package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByBuyerId(Long buyerId);
}
