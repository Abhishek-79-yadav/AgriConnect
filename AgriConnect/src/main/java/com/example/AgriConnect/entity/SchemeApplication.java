package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// A farmer's application to a GovernmentScheme. Document verification is
// tracked separately from the final approve/reject decision (documentVerified
// + verificationRemarks vs status + decisionRemarks) — a government
// reviewer can verify the paperwork is in order as a distinct step before
// committing to approve or reject, and the two can be audited independently.
@Entity
@Table(name = "scheme_application")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchemeApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private GovernmentScheme scheme;

    @ManyToOne
    private User applicant;

    private String documentUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SchemeApplicationStatus status = SchemeApplicationStatus.SUBMITTED;

    @Builder.Default
    private boolean documentVerified = false;

    @Column(length = 1000)
    private String verificationRemarks;

    @Column(length = 1000)
    private String decisionRemarks;

    private LocalDateTime appliedAt;

    private LocalDateTime reviewedAt;

    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @PrePersist
    public void prePersist() {
        if (appliedAt == null) {
            appliedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = SchemeApplicationStatus.SUBMITTED;
        }
    }
}