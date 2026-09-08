package com.example.AgriConnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// A dedicated logistics record for one order — one shipment per order.
// Order keeps its own flat carrier/trackingNumber/trackingUrl/deliveredAt
// fields for backward compatibility with existing code (checkout flow,
// OrderResponse, the buyer tracking view); this entity is kept in sync
// with those on every transition (see ShipmentService) rather than
// replacing them, so nothing that already reads Order's fields breaks.
@Entity
@Table(name = "shipment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", unique = true)
    @JsonIgnore
    private Order order;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;

    private String carrier;
    private String trackingNumber;
    private String trackingUrl;

    // The person/vehicle actually doing the delivery run — distinct from
    // the carrier (e.g. carrier = "Delhivery", agent = the local rider).
    private String deliveryAgentName;
    private String deliveryAgentPhone;
    private String vehicleNumber;

    private LocalDate expectedDeliveryDate;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    // Real-world deliveries don't always succeed on the first try — this
    // counts how many delivery attempts have been made so far (missing
    // entirely from the old flat-field tracking on Order).
    @Builder.Default
    private int deliveryAttempts = 0;

    // Captured on successful delivery — who actually received the parcel.
    private String proofOfDeliveryName;
    private String proofOfDeliveryNote;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL)
    @OrderBy("createdAt ASC")
    private List<ShipmentEvent> events;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = ShipmentStatus.CREATED;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
