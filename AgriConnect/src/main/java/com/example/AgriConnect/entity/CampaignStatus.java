package com.example.AgriConnect.entity;

public enum CampaignStatus {
    DRAFT,      // being authored, never shown publicly
    SCHEDULED,  // approved, waiting for startDate
    ACTIVE,     // currently live (computed from dates, but also settable to pause early)
    PAUSED,     // manually paused by an admin before its natural end
    ENDED       // past endDate, or manually ended
}
