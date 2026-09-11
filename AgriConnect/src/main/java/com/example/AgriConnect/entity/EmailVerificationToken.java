package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String token;

    @OneToOne
    private User user;

    private LocalDateTime expiryTime;

    @PrePersist
    public void generateToken() {
        if (token == null)
            token = UUID.randomUUID().toString();

        expiryTime = LocalDateTime.now().plusHours(24);
    }
}