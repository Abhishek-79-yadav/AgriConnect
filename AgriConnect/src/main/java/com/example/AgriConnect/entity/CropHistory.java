package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CropHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User farmer;

    private String cropName;
    private double yield;
    private String season;
    private LocalDate date;

    private double sellingPricePerUnit;
    private double costPricePerUnit;
    private double quantity;

    // What was applied to this crop cycle, and how much. Free-text name
    // (not a foreign key to a product catalog) since farmers use branded,
    // generic, or locally-mixed inputs interchangeably.
    private String fertilizerUsed;
    private Double fertilizerQuantityKg;
    private String pesticideUsed;

    // Explicit column name: Hibernate's default naming strategy doesn't
    // insert an underscore before a trailing single capital letter, so
    // "pesticideQuantityL" would otherwise map to "pesticide_quantityl"
    // (no underscore before the final "l"), which doesn't match the
    // "pesticide_quantity_l" column the migration actually created.
    @Column(name = "pesticide_quantity_l")
    private Double pesticideQuantityL;
}