package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GovernmentScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    private String state;
    private String category;

    private String applyLink;

    private boolean active = true;

    @ManyToOne
    private Department department;

    // Free-text eligibility criteria shown to farmers before they apply —
    // deliberately not a structured rule engine (income thresholds, land
    // size, etc. vary too much scheme to scheme to model generically);
    // government explains it in plain language, farmers self-assess
    // before applying, and document verification is the actual check.
    @Column(length = 2000)
    private String eligibilityCriteria;
}