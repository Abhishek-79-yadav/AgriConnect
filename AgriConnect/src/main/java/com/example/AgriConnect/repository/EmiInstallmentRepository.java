package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.EmiInstallment;
import com.example.AgriConnect.entity.EmiInstallmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface EmiInstallmentRepository extends JpaRepository<EmiInstallment, Long> {

    List<EmiInstallment> findByEmiPlan_IdOrderByInstallmentNumberAsc(Long emiPlanId);

    // Installments still unpaid past their due date — the credit-risk signal.
    @Query("SELECT i FROM EmiInstallment i WHERE i.status = :pending AND i.dueDate < :today " +
            "AND i.emiPlan.buyer.id = :buyerId")
    List<EmiInstallment> findOverdueForBuyer(
            @org.springframework.data.repository.query.Param("buyerId") Long buyerId,
            @org.springframework.data.repository.query.Param("pending") EmiInstallmentStatus pending,
            @org.springframework.data.repository.query.Param("today") LocalDate today);

    @Query("SELECT i FROM EmiInstallment i WHERE i.status = :pending AND i.dueDate < :today")
    List<EmiInstallment> findAllOverdue(
            @org.springframework.data.repository.query.Param("pending") EmiInstallmentStatus pending,
            @org.springframework.data.repository.query.Param("today") LocalDate today);
}
