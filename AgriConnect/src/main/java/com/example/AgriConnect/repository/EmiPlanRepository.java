package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.EmiPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmiPlanRepository extends JpaRepository<EmiPlan, Long> {
    Optional<EmiPlan> findByOrder_Id(Long orderId);
    List<EmiPlan> findByBuyer_Id(Long buyerId);
}
