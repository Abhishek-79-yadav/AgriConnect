package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Every item belonging to a paid order (buyer has paid — either
    // COD-delivered or ONLINE-verified), regardless of payout status.
    // Used to build the full per-farmer payout summary.
    @Query("select oi from OrderItem oi where oi.order.paid = true")
    List<OrderItem> findAllFromPaidOrders();
}
