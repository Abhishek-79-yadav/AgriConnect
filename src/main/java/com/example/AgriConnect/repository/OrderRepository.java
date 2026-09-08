package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Order;
import com.example.AgriConnect.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Buyer orders
    List<Order> findByBuyer_Id(Long buyerId);

    // Used by PhonePeService to bind a callback/status-check back to the order.
    java.util.Optional<Order> findByPhonepeTransactionId(String phonepeTransactionId);

    // Farmer orders
    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i " +
            "WHERE i.product.farmer.id = :farmerId")
    List<Order> findFarmerOrders(@Param("farmerId") Long farmerId);

    @Query("SELECT COUNT(DISTINCT o.id) FROM Order o JOIN o.items i " +
            "WHERE i.product.farmer.id = :farmerId")
    long countFarmerOrders(@Param("farmerId") Long farmerId);

    @Query("SELECT COUNT(DISTINCT o.id) FROM Order o JOIN o.items i " +
            "WHERE i.product.farmer.id = :farmerId AND o.status = :status")
    long countFarmerOrdersByStatus(@Param("farmerId") Long farmerId,
                                   @Param("status") OrderStatus status);

    @Query("SELECT COALESCE(SUM(i.price), 0) FROM Order o JOIN o.items i " +
            "WHERE i.product.farmer.id = :farmerId AND o.status = :status")
    Double sumRevenueByFarmerAndStatus(@Param("farmerId") Long farmerId,
                                       @Param("status") OrderStatus status);
}