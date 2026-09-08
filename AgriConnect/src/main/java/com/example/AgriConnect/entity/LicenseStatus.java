package com.example.AgriConnect.entity;

public enum LicenseStatus {
    PENDING,    // farmer applied, awaiting government review
    ACTIVE,     // approved and currently valid
    REJECTED,   // government declined the application
    SUSPENDED,  // temporarily halted by government — can be resumed to ACTIVE
    CANCELLED,  // was ACTIVE, government revoked it permanently
    APPROVED, EXPIRED     // past its expiry date
}
