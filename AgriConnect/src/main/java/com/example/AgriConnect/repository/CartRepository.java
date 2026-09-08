package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByBuyerId(Long buyerId);

    void deleteByBuyerId(Long buyerId);

    Optional<Cart> findByBuyerIdAndProductId(Long buyerId, Long productId);
}