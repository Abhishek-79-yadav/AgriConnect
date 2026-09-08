package com.example.AgriConnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// One batch delivered against a contract — contract farming deliveries
// often happen in multiple batches at harvest rather than all at once,
// which a single running total on Contract alone couldn't audit.
@Entity
@Table(name = "contract_delivery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractDelivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    @JsonIgnore
    private Contract contract;

    private Double quantity;

    @Column(length = 500)
    private String note;

    private LocalDateTime deliveredAt;

    @PrePersist
    public void prePersist() {
        if (deliveredAt == null) deliveredAt = LocalDateTime.now();
    }
}
