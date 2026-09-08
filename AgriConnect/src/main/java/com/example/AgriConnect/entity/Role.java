package com.example.AgriConnect.entity;

public enum Role {
    FARMER,
    BUYER,
    BRAND,
    ADMIN,
    SUPER_ADMIN,
    // Government official — not self-registerable (see AuthService.
    // SELF_REGISTERABLE_ROLES); created directly by a super admin, same
    // as ADMIN. Manages government schemes, farmer warehouse licenses,
    // and tax records.
    GOVERNMENT
}