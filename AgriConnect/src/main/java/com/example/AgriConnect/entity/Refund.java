package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// A refund against a paid order — created automatically when a paid order
// is cancelled or a return is marked COMPLETED. There's no real payment
// gateway refund integration here (Razorpay/PhonePe refund APIs need
// live credentials and settlement time this platform doesn't model), so
// refunds are settled into the buyer's platform Wallet instead — that's
// real, working money movement rather than a fake "refunded" flag.
@Entity
@Table(name = "refund")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Order order;

    // Optional — null means the refund covers the whole order.
    @ManyToOne
    private OrderItem orderItem;

    @ManyToOne
    private User buyer;

    private Double amount;

    @Column(length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    private RefundStatus status;

    // Currently always "WALLET" — kept as a field so a real gateway refund
    // method can be added later without a schema change.
    private String method;

    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = RefundStatus.INITIATED;
        }
        if (method == null) {
            method = "WALLET";
        }
    }
}
