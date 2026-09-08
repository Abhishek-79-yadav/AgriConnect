package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// Contract farming — a forward agreement for produce that doesn't exist
// as a listing yet, unlike Order (immediate, from stock) and Offer (spot
// negotiation on an existing listing). A buyer or brand proposes a
// quantity/price/delivery-date to a farmer; once the farmer accepts it
// becomes ACTIVE and the farmer delivers against it — possibly in
// batches at harvest (see ContractDelivery) — until the agreed quantity
// is met and it's FULFILLED.
@Entity
@Table(name = "contract")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The BUYER or BRAND proposing the contract.
    @ManyToOne(fetch = FetchType.LAZY)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    private User farmer;

    @ManyToOne(fetch = FetchType.LAZY)
    private Crop crop;

    private Double quantity;

    @Enumerated(EnumType.STRING)
    private Unit unit;

    @Column(precision = 12, scale = 2)
    private BigDecimal agreedPrice;

    // Optional upfront payment, common in real contract farming to help
    // the farmer cover input costs before harvest.
    @Column(precision = 12, scale = 2)
    private BigDecimal advancePayment;

    private LocalDate startDate;
    private LocalDate deliveryDate;

    @Column(length = 2000)
    private String terms;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ContractStatus status = ContractStatus.PROPOSED;

    // Running total from ContractDelivery rows — kept denormalized here
    // so "how much is left to deliver" doesn't need a separate aggregate
    // query every time the contract is viewed.
    @Builder.Default
    private Double deliveredQuantity = 0.0;

    private LocalDateTime respondedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL)
    @OrderBy("deliveredAt ASC")
    private List<ContractDelivery> deliveries;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = ContractStatus.PROPOSED;
        if (deliveredQuantity == null) deliveredQuantity = 0.0;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
