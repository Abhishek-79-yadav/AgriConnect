package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class SubscriptionResponse {
    private Long id;
    private String planName;
    private String planTier;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;

    // Convenience for the frontend — true only if active AND endDate hasn't
    // passed, so the UI doesn't need to do its own date math.
    private boolean currentlyValid;
}
