package com.example.AgriConnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// An immutable ledger line — wallet.balance is convenience, this table is
// the audit trail (what moved, why, and what it was linked to: a refund,
// a payout, an EMI installment, etc).
@Entity
@Table(name = "wallet_transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private Wallet wallet;

    @Enumerated(EnumType.STRING)
    private WalletTransactionType type;

    private Double amount;

    private String reason;

    // e.g. "REFUND", "PAYOUT", "EMI_INSTALLMENT" — what this line relates to.
    private String referenceType;

    private Long referenceId;

    private Double balanceAfter;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
