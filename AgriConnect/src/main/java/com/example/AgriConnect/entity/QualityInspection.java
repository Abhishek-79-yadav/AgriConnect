package com.example.AgriConnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// One inspection record for a warehouse receipt. Kept as a ManyToOne
// (rather than a single embedded result) so a receipt can be re-inspected
// later — e.g. after a dispute, or ahead of expiry — without losing the
// original inspection's history.
@Entity
@Table(name = "quality_inspection")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QualityInspection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "warehouse_receipt_id")
    @JsonIgnore
    private WarehouseReceipt warehouseReceipt;

    // GOVERNMENT (or ADMIN) user who carried out the inspection — same
    // role that reviews warehouse licenses.
    @ManyToOne
    @JoinColumn(name = "inspector_id")
    private User inspector;

    @Enumerated(EnumType.STRING)
    private QualityGrade grade;

    private Double moisturePercent;
    private Double foreignMatterPercent;

    private boolean passed;

    @Column(length = 1000)
    private String remarks;

    private LocalDateTime inspectedAt;

    @PrePersist
    public void prePersist() {
        if (inspectedAt == null) inspectedAt = LocalDateTime.now();
    }
}
