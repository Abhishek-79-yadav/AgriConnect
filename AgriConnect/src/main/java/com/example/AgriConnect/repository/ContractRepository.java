package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByBuyer_IdOrderByCreatedAtDesc(Long buyerId);

    List<Contract> findByFarmer_IdOrderByCreatedAtDesc(Long farmerId);
}
