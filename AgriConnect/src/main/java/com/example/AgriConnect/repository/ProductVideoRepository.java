package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.ProductVideo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductVideoRepository extends JpaRepository<ProductVideo, Long> {

    List<ProductVideo> findByProductId(Long productId);

    List<ProductVideo> findByFarmerId(Long farmerId);
}