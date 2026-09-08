package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.ContractDelivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContractDeliveryRepository extends JpaRepository<ContractDelivery, Long> {

    List<ContractDelivery> findByContract_IdOrderByDeliveredAtAsc(Long contractId);
}
