package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class CropInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Crop crop;

    private String title;
    private String description;
    private String videoUrl;
}