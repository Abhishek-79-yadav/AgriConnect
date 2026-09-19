package com.example.AgriConnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// A buyer's price/quantity negotiation on a product, separate from the
// fixed-price cart/checkout flow. Farmer can accept, reject, or counter;
// buyer can accept/reject a counter or withdraw. Once ACCEPTED, the offer
// converts into a real Order at the agreed price (see OfferService —
// status becomes CONVERTED once that happens, so it can't be converted
// twice).
@Entity
@Table(name = "offer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    private User buyer;

    // Denormalized alongside product.farmer — same convention Order.buyer
    // follows relative to its items' products — so farmer-side queries
    // don't need to join through product.
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private User farmer;

    private Double quantity;

    @Column(precision = 12, scale = 2)
    private BigDecimal offeredPrice;

    @Column(length = 500)
    private String message;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OfferStatus status = OfferStatus.PENDING;

    // Set only when the farmer counters — a different price/message from
    // the buyer's original offer, awaiting the buyer's response.
    @Column(precision = 12, scale = 2)
    private BigDecimal counterPrice;

    @Column(length = 500)
    private String counterMessage;

    // Filled in once the offer reaches a final state (ACCEPTED/REJECTED/
    // CONVERTED) — separate from createdAt/updatedAt so "how long did this
    // negotiation take" is directly queryable later if needed.
    private LocalDateTime respondedAt;

    // Set once this offer is converted into a real Order (see
    // OfferService.checkout) — lets the buyer/farmer jump straight from
    // the offer to the resulting order.
    private Long convertedOrderId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = OfferStatus.PENDING;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
