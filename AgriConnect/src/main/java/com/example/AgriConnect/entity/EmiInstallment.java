package com.example.AgriConnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "emi_installment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmiInstallment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private EmiPlan emiPlan;

    private Integer installmentNumber;

    private Double amount;

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private EmiInstallmentStatus status;

    private LocalDateTime paidAt;
}
