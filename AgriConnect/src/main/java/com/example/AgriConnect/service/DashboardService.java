package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.DashboardResponse;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.ProductRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public DashboardResponse getFarmerDashboard(String email) {

        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));

        long totalProducts = productRepository.countByFarmer_Id(farmer.getId());

        double totalRevenue = productRepository.findByFarmer_Id(farmer.getId())
                .stream()
                .mapToDouble(p ->
                        p.getPrice()
                                .multiply(BigDecimal.valueOf(p.getQuantity()))
                                .doubleValue()
                )
                .sum();

        return DashboardResponse.builder()
                .farmerName(farmer.getName())
                .totalProducts(totalProducts)
                .totalRevenue(totalRevenue)
                .build();
    }
}