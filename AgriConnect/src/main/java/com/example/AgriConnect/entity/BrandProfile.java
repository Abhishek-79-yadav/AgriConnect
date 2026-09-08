package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrandProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String companyName;
    private String gstNumber;

    // Free-text for now (e.g. "Fertilizer", "Pesticide", "Both") — not an
    // enum since the set of categories a company sells under will likely
    // grow past what we'd want to hardcode.
    private String category;
}
