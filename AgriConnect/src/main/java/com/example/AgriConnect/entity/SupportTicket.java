package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// A general "Contact support" message from the Help Center — deliberately
// separate from Dispute, which is always tied to a specific order. This
// covers everything else: account questions, how-to help, bug reports.
@Entity
@Table(name = "support_ticket")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    // Free-form-ish category from the Help Center form, e.g. "Account",
    // "Orders", "Payments", "Other" — kept as a plain string rather than
    // an enum since new categories are just copy, not a schema change.
    private String category;

    @Column(length = 255)
    private String subject;

    @Column(length = 2000)
    private String message;

    @Enumerated(EnumType.STRING)
    private SupportTicketStatus status;

    @Column(length = 2000)
    private String adminResponse;

    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = SupportTicketStatus.OPEN;
        }
    }
}
