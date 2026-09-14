package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

// A reference tax rate (e.g. "GST — Seeds — 5%") that government
// maintains for transparency/lookup. Deliberately not wired into
// checkout pricing — see the note on TaxRecord for why the marketplace
// doesn't auto-calculate tax today; this is the rate table that a
// TaxRecord's numbers should be *consistent with*, not a live rule engine.
@Entity
@Table(name = "tax_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String taxType;

    private String category;

    private Double ratePercent;

    private String description;

    @Builder.Default
    private boolean active = true;

    private LocalDate effectiveFrom;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}