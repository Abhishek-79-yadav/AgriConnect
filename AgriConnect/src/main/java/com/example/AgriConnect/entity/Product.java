package com.example.AgriConnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer totalRatings = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    @Column(precision = 12, scale = 2)
    private BigDecimal price;
    private Double quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Crop crop;

    private String category;
    private String description;

    @Enumerated(EnumType.STRING)
    private Unit unit;

    private String city;
    private String state;
    private String country;

    private String imageUrl;
    private String videoUrl;

    // New listings need admin approval before they're visible to buyers
    // (see ProductService.getApprovedProducts / AdminController.approveProduct).
    @Builder.Default
    private boolean approved = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private User farmer;

    // ✅ ADD THIS (IMPORTANT FIX)
    private boolean available = true;
}