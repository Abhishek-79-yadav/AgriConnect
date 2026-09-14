package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

// A tax filing/due record a government official keeps against a farmer
// or brand account — e.g. "GST for 2026-Q1: ₹4,200, due 2026-04-20".
// Deliberately a manually-maintained ledger rather than something
// auto-derived from order totals: the marketplace doesn't compute or
// collect tax on checkout today, so this is the government's own
// record-keeping, not a live tax-calculation engine.
@Entity
@Table(name = "tax_record")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The farmer or brand this tax record belongs to.
    @ManyToOne
    private User user;

    // Free-form period label, e.g. "2026-Q1", "2026-04" — kept as a
    // string rather than a date range so it can match however the
    // government actually files (quarterly, monthly, annually).
    private String period;

    private Double taxableAmount;

    private Double taxAmount;

    @Builder.Default
    private String taxType = "GST";

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TaxRecordStatus status = TaxRecordStatus.PENDING;

    private LocalDate dueDate;

    private LocalDateTime paidAt;

    @Column(length = 1000)
    private String remarks;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = TaxRecordStatus.PENDING;
        }
    }
}