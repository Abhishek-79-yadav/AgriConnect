package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

// A farmer's registration/license for operating a storage warehouse —
// applied for by the farmer, reviewed (approved/rejected/cancelled) by a
// GOVERNMENT-role user. Distinct from the marketplace's shipment/dispatch
// model (see the Order/OrderStatusHistory tracking) — this is a
// regulatory record, not a fulfillment one.
@Entity
@Table(name = "warehouse_license")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseLicense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User farmer;

    private String warehouseName;

    private String location;

    private Double capacityTonnes;

    // Assigned by the government reviewer on approval — null while PENDING.
    private String licenseNumber;

    // Supporting document (ownership proof, safety certificate, etc.)
    // uploaded by the farmer at application time.
    private String documentUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LicenseStatus status = LicenseStatus.PENDING;

    @Column(length = 1000)
    private String remarks;

    private LocalDateTime appliedAt;

    private LocalDateTime reviewedAt;

    private LocalDate expiryDate;

    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @PrePersist
    public void prePersist() {
        if (appliedAt == null) {
            appliedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = LicenseStatus.PENDING;
        }
    }
}