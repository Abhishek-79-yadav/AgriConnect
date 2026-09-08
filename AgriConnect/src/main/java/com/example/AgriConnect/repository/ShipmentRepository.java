package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    Optional<Shipment> findByOrder_Id(Long orderId);

    boolean existsByOrder_Id(Long orderId);
}
