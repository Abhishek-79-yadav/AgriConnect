package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Product;
import com.example.AgriConnect.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByProductNameContainingIgnoreCase(String name);

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByCityIgnoreCase(String city);

    List<Product> findByStateIgnoreCase(String state);

    List<Product> findByPriceBetween(BigDecimal min, BigDecimal max);

    List<Product> findByFarmer_Id(Long farmerId);

    long countByFarmer_Id(Long farmerId);

    List<Product> findByUnit(Unit unit);
}