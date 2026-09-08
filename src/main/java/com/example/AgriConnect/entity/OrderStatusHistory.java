package com.example.AgriConnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// One row per status transition an order goes through — powers the
// buyer-facing "delivery timeline" view. Written alongside every status
// change instead of being derived after the fact, so it also captures
// timestamps for stages the order has already moved past.
@Entity
@Table(name = "order_status_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private Order order;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String note;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
