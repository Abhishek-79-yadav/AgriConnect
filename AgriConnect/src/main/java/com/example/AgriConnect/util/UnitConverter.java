package com.example.AgriConnect.util;

import com.example.AgriConnect.entity.Unit;

public final class UnitConverter {

    // 🚫 prevent object creation
    private UnitConverter() {
        throw new UnsupportedOperationException("Utility class");
    }

    // BASE: KG
    public static double toBaseKg(double qty, Unit unit) {

        validate(qty, unit);

        return switch (unit) {
            case KG -> qty;
            case GM -> qty / 1000.0;
            case QUINTAL -> qty * 100;
        };
    }

    // CONVERT ANY UNIT TO ANY UNIT
    public static double convert(double qty, Unit from, Unit to) {

        validate(qty, from);
        if (to == null) {
            throw new IllegalArgumentException("Target unit cannot be null");
        }

        double inKg = toBaseKg(qty, from);

        return switch (to) {
            case KG -> inKg;
            case GM -> inKg * 1000;
            case QUINTAL -> inKg / 100;
        };
    }

    // VALIDATION LOGIC
    private static void validate(double qty, Unit unit) {

        if (unit == null) {
            throw new IllegalArgumentException("Unit cannot be null");
        }

        if (qty < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }
    }
}