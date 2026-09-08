package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id")
    private User farmer;

    private String soilType;
    private String state;
    private String city;

    // In acres — how much land the farmer is working with. Static profile
    // data (set once, edited rarely), unlike fertilizer/pesticide use which
    // varies per crop cycle and lives on CropHistory instead.
    private Double landSizeAcres;
}