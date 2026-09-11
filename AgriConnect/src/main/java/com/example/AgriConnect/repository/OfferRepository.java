package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {

    List<Offer> findByBuyer_IdOrderByCreatedAtDesc(Long buyerId);

    List<Offer> findByFarmer_IdOrderByCreatedAtDesc(Long farmerId);

    List<Offer> findByProduct_IdOrderByCreatedAtDesc(Long productId);
}
