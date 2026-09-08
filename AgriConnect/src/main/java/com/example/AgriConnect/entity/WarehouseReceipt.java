package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

// Issued when a farmer physically stores produce at one of their APPROVED
// warehouses (see WarehouseLicense). Independent of the marketplace —
// produce can be stored and quality-graded before the farmer decides to
// list it for sale. A receipt only becomes ISSUED (with a receiptNumber)
// once a QualityInspection passes; a failed inspection rejects it outright
// rather than leaving it stuck pending.
@Entity
@Table(name = "warehouse_receipt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private WarehouseLicense warehouseLicense;

    // Denormalized alongside warehouseLicense.farmer for direct
    // "my receipts" queries, same convention Order.buyer follows relative
    // to its items' products.
    @ManyToOne
    private User farmer;

    @ManyToOne
    private Crop crop;

    private Double quantity;

    @Enumerated(EnumType.STRING)
    private Unit unit;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private WarehouseReceiptStatus status = WarehouseReceiptStatus.PENDING_INSPECTION;

    // Assigned only once ISSUED — null while pending or if rejected.
    private String receiptNumber;

    @Column(length = 1000)
    private String remarks;

    private LocalDateTime storedAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "warehouseReceipt", cascade = CascadeType.ALL)
    @OrderBy("inspectedAt DESC")
    private List<QualityInspection> inspections;

    @PrePersist
    public void prePersist() {
        if (storedAt == null) storedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = WarehouseReceiptStatus.PENDING_INSPECTION;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
