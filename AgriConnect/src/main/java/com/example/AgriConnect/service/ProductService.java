package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.ProductRequest;
import com.example.AgriConnect.dto.response.ProductResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.CropRepository;
import com.example.AgriConnect.repository.ProductRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CropRepository cropRepository;

    // =========================
    // CURRENT USER
    // =========================
    private User getFarmer() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new ApiException("No authenticated user found");
        }

        System.out.println("========== AUTH ==========");
        System.out.println("Auth Name = " + auth.getName());

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ApiException("Farmer not found: " + auth.getName()));

        System.out.println("DB User ID = " + user.getId());
        System.out.println("DB Email = " + user.getEmail());
        System.out.println("==========================");

        return user;
    }

    // =========================
    // ADD PRODUCT
    // =========================
    public ProductResponse addProduct(ProductRequest request) {

        User farmer = getFarmer();

        if (request.getCropId() == null) {
            throw new ApiException("Please select a crop");
        }

        Crop crop = cropRepository.findById(request.getCropId())
                .orElseThrow(() -> new ApiException("Crop not found"));

        Product product = Product.builder()
                .productName(request.getProductName())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .crop(crop)
                .category(request.getCategory())
                .description(request.getDescription())
                .unit(parseUnit(request.getUnit()))
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .imageUrl(request.getImageUrl())
                .videoUrl(request.getVideoUrl())
                .available(true)
                .approved(false)
                .farmer(farmer)
                .build();

        return mapToResponse(productRepository.save(product));
    }

    // =========================
    // FARMER PRODUCTS
    // =========================
    public List<ProductResponse> getFarmerProducts() {

        User farmer = getFarmer();

        System.out.println("========== FARMER ==========");
        System.out.println("ID = " + farmer.getId());
        System.out.println("Email = " + farmer.getEmail());

        List<Product> products = productRepository.findByFarmer_Id(farmer.getId());

        System.out.println("Products Found = " + products.size());

        products.forEach(p ->
                System.out.println(
                        p.getId() + " " +
                                p.getProductName() + " FarmerId=" +
                                p.getFarmer().getId()
                )
        );

        return products.stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================
    // UPDATE PRICE
    // =========================
    public ProductResponse updatePrice(Long productId, BigDecimal price) {

        if (price.compareTo(BigDecimal.ZERO) < 0) {
            throw new ApiException("Price cannot be negative");
        }

        User farmer = getFarmer();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException("Product not found"));

        if (!product.getFarmer().getId().equals(farmer.getId()))
            throw new ApiException("Not allowed");

        product.setPrice(price);

        return mapToResponse(productRepository.save(product));
    }

    // =========================
    // DELETE (SOFT DELETE)
    // =========================
    public void deleteProduct(Long id) {

        User farmer = getFarmer();

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found"));

        if (!product.getFarmer().getId().equals(farmer.getId()))
            throw new ApiException("Not allowed");

        product.setAvailable(false);
        productRepository.save(product);
    }

    // =========================
    // ALL PRODUCTS
    // =========================
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .filter(Product::isAvailable)
                .filter(Product::isApproved)
                .map(this::mapToResponse)
                .toList();
    }

    // =========================
    // UNIT PARSER
    // =========================
    private Unit parseUnit(String unit) {
        try {
            return Unit.valueOf(unit.trim().toUpperCase());
        } catch (Exception e) {
            throw new ApiException("Invalid unit");
        }
    }

    // =========================
    // MAPPER
    // =========================
    private ProductResponse mapToResponse(Product p) {

        return ProductResponse.builder()
                .id(p.getId())
                .productName(p.getProductName())
                .price(p.getPrice())
                .quantity(p.getQuantity())
                .unit(p.getUnit() != null ? p.getUnit().name() : null)
                .crop(p.getCrop() != null ? p.getCrop().getName() : null)
                .category(p.getCategory())
                .city(p.getCity())
                .state(p.getState())
                .farmerName(
                        p.getFarmer() != null ? p.getFarmer().getName() : null
                )
                .farmerId(
                        p.getFarmer() != null ? p.getFarmer().getId() : null
                )
                .farmerEmail(
                        p.getFarmer() != null ? p.getFarmer().getEmail() : null
                )
                .imageUrl(p.getImageUrl())
                .videoUrl(p.getVideoUrl())
                .totalPrice(
                        p.getPrice() != null && p.getQuantity() != null
                                ? p.getPrice().multiply(BigDecimal.valueOf(p.getQuantity()))
                                : BigDecimal.ZERO
                )
                .approved(p.isApproved())
                .build();
    }
}