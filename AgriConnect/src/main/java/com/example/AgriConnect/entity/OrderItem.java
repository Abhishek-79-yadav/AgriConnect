package com.example.AgriConnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private Order order;

    @ManyToOne
    private Product product;

    private Double quantity;

    private Double price;

    // Whether the platform has paid the farmer their share for this line
    // item yet. Independent of the order's own `paid` flag, which tracks
    // whether the BUYER has paid — this tracks whether the FARMER has been
    // paid out (only eligible once the order itself is paid).
    @Builder.Default
    private String payoutStatus = "PENDING";
}