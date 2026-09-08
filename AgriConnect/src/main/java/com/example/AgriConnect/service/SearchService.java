package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.ProductResponse;
import com.example.AgriConnect.entity.Product;
import com.example.AgriConnect.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final ProductRepository productRepository;

    public List<ProductResponse> searchByName(String keyword) {

        return productRepository.findByProductNameContainingIgnoreCase(keyword)
                .stream()
                .filter(Product::isAvailable)
                .map(this::mapToResponse)
                .toList();
    }

    public List<ProductResponse> searchByCategory(String category) {

        return productRepository.findByCategoryIgnoreCase(category)
                .stream()
                .filter(Product::isAvailable)
                .map(this::mapToResponse)
                .toList();
    }

    public List<ProductResponse> searchByCity(String city) {

        return productRepository.findByCityIgnoreCase(city)
                .stream()
                .filter(Product::isAvailable)
                .map(this::mapToResponse)
                .toList();
    }

    public List<ProductResponse> searchByState(String state) {

        return productRepository.findByStateIgnoreCase(state)
                .stream()
                .filter(Product::isAvailable)
                .map(this::mapToResponse)
                .toList();
    }

    public List<ProductResponse> searchByPrice(BigDecimal min, BigDecimal max) {

        return productRepository.findByPriceBetween(min, max)
                .stream()
                .filter(Product::isAvailable)
                .map(this::mapToResponse)
                .toList();
    }

    private ProductResponse mapToResponse(Product p) {

        return ProductResponse.builder()
                .id(p.getId())
                .productName(p.getProductName())
                .price(p.getPrice())
                .quantity(p.getQuantity())
                .crop(p.getCrop().getName())
                .unit(p.getUnit().name())
                .category(p.getCategory())
                .city(p.getCity())
                .state(p.getState())
                .farmerName(p.getFarmer().getName())
                .farmerEmail(p.getFarmer().getEmail())
                .imageUrl(p.getImageUrl())
                .videoUrl(p.getVideoUrl())
                .build();
    }
}