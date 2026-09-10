package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgriInput {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private User company;

    private String name;
    private String description;

    // "FERTILIZER" or "PESTICIDE" — free text like BrandProfile.category
    // rather than an enum, for the same reason (the set of categories a
    // company sells under may grow).
    private String category;

    private double price;
    private double stock;
    private String unit;
    private String imageUrl;

    @Builder.Default
    private boolean approved = false;
}
