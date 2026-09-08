package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "campaign")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private CampaignType type;

    @Enumerated(EnumType.STRING)
    private CampaignStatus status;

    private String bannerImageUrl;

    private String linkUrl;

    private String couponCode;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CampaignTargetRole targetRole = CampaignTargetRole.ALL;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Builder.Default
    private Long impressions = 0L;

    @Builder.Default
    private Long clicks = 0L;

    // IMPORTANT:
    // Database column = created_by_id
    // This must match the Flyway migration below.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (status == null) {
            status = CampaignStatus.DRAFT;
        }
    }
}