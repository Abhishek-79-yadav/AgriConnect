package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@Builder   // ⭐ ADD THIS
@NoArgsConstructor
@AllArgsConstructor
public class ProductVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String videoUrl;
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    private User farmer;
}