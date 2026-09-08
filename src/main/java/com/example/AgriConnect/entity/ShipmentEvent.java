package com.example.AgriConnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// One row per tracking checkpoint — powers the buyer-facing shipment
// timeline (like a courier's public tracking page). Unlike
// OrderStatusHistory (which just logs order-level status + a free-text
// note), this also captures WHERE the parcel was at that point.
@Entity
@Table(name = "shipment_event")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shipment_id")
    @JsonIgnore
    private Shipment shipment;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;

    private String location;
    private String note;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
