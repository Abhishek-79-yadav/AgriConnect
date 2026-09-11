package com.example.AgriConnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "users",
        indexes = {
                @Index(name = "idx_user_email", columnList = "email")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Column(nullable = false)
    @Builder.Default
    private boolean emailVerified = false;

    private String profileImage;

    @Builder.Default
    private boolean enabled = true;

    // Set when an admin suspends this account (see AdminController.suspendUser).
    // Cleared on unsuspend. Distinct from a BRAND account's "pending
    // approval" state (enabled=false but no reason set).
    private String suspensionReason;

    // Self-service deactivation ("Settings > Deactivate my account"). Also
    // sets enabled=false, but — unlike an admin suspension — logging back
    // in with the correct password automatically reactivates the account
    // (see AuthService.login). Null when the account isn't deactivated.
    private LocalDateTime deactivatedAt;

    // Self-service deletion. Unlike deactivation this is NOT reversible by
    // logging back in — the account stays disabled and its personal data
    // is anonymized (see UserService.deleteAccount). The row itself is
    // kept rather than hard-deleted because orders/products/reviews still
    // reference this user id and deleting it would break that history for
    // the other party (farmer/buyer) on each of those records.
    private LocalDateTime deletionRequestedAt;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 100)
    // Never serialize this — several endpoints (getAdmins, getPendingAdmins,
    // getGovernmentOfficials) return raw User entities rather than a DTO,
    // and without this the bcrypt hash would be sent straight to the
    // frontend on every one of them.
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(length = 10)
    private String mobile;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 255)
    private String resetToken;

    private LocalDateTime resetTokenExpiry;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }


    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}