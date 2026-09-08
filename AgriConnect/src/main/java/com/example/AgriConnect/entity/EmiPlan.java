package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

// A buyer's opt-in to pay off a placed-but-unpaid ONLINE order in
// installments instead of all at once. One plan per order (hence the
// unique order_id in the migration).
@Entity
@Table(name = "emi_plan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmiPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Order order;

    @ManyToOne
    private User buyer;

    private Double totalAmount;

    private Integer numberOfInstallments;

    @OneToMany(mappedBy = "emiPlan", cascade = CascadeType.ALL)
    @Builder.Default
    private List<EmiInstallment> installments = new java.util.ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
