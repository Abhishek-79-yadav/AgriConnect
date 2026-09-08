package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.ReturnRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {

    List<ReturnRequest> findByBuyer_IdOrderByRequestedAtDesc(Long buyerId);

    // Returns for orders that contain at least one product belonging to
    // this farmer — mirrors OrderRepository.findFarmerOrders().
    @Query("SELECT DISTINCT r FROM ReturnRequest r JOIN r.order o JOIN o.items i " +
            "WHERE i.product.farmer.id = :farmerId ORDER BY r.requestedAt DESC")
    List<ReturnRequest> findFarmerReturns(@Param("farmerId") Long farmerId);
}
