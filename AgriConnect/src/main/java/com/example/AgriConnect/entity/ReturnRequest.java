package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// A buyer-initiated return on a delivered order (or one line item within
// it). Farmer (whose product it is) or an admin then approves/rejects it;
// an approved return is later marked COMPLETED once the item is actually
// back with the farmer, at which point stock is restored.
@Entity
@Table(name = "return_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Order order;

    // Optional — null means the return applies to the whole order.
    @ManyToOne
    private OrderItem orderItem;

    @ManyToOne
    private User buyer;

    @Column(length = 1000)
    private String reason;

    @Enumerated(EnumType.STRING)
    private ReturnStatus status;

    @Column(length = 1000)
    private String adminNote;

    private LocalDateTime requestedAt;

    private LocalDateTime resolvedAt;

    @PrePersist
    public void prePersist() {
        if (requestedAt == null) {
            requestedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = ReturnStatus.REQUESTED;
        }
    }
}
