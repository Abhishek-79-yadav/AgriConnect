package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.ShipmentEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShipmentEventRepository extends JpaRepository<ShipmentEvent, Long> {

    List<ShipmentEvent> findByShipment_IdOrderByCreatedAtAsc(Long shipmentId);
}
