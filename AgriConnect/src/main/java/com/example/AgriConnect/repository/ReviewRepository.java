package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct_IdOrderByCreatedAtDesc(Long productId);
    List<Review> findByBuyer_IdOrderByCreatedAtDesc(Long buyerId);
    List<Review> findByProduct_Farmer_IdOrderByCreatedAtDesc(Long farmerId);
    Optional<Review> findByBuyer_IdAndOrderItem_Id(Long buyerId, Long orderItemId);
    boolean existsByBuyer_IdAndOrderItem_Id(Long buyerId, Long orderItemId);
}
