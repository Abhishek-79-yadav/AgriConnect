package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// A verified-purchase review — tied to the specific OrderItem it came
// from (not just product + buyer), so a buyer can review the same
// product again after a separate purchase, but never before actually
// receiving it once (see ReviewService.create for the DELIVERED check).
@Entity
@Table(name = "review")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Product product;

    @ManyToOne
    private User buyer;

    @ManyToOne
    private OrderItem orderItem;

    private Integer rating;

    @Column(length = 1000)
    private String comment;

    // The farmer's (product owner's) reply to this review, if any.
    @Column(length = 1000)
    private String farmerReply;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
