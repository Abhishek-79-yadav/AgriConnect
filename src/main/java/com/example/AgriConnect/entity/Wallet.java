package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// One wallet per user — currently used for buyer refund credits and
// farmer payout credits. Balance is denormalized on the wallet row (not
// re-summed from transactions on every read) for cheap balance checks
// during checkout/debit; WalletTransaction is still the source of truth
// for history and can be replayed to reconcile it if it ever drifts.
@Entity
@Table(name = "wallet")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    @Builder.Default
    private Double balance = 0.0;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void touch() {
        updatedAt = LocalDateTime.now();
    }
}
