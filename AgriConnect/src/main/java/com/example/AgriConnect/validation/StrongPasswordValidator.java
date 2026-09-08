package com.example.AgriConnect.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {

    private static final Pattern HAS_LETTER = Pattern.compile("[A-Za-z]");
    private static final Pattern HAS_DIGIT = Pattern.compile("\\d");
    // Deliberately not "everything that isn't alphanumeric" — a fixed set
    // avoids surprising rejections from unicode punctuation/whitespace
    // quirks while still covering the common special characters people
    // actually use.
    private static final Pattern HAS_SPECIAL = Pattern.compile("[@#$%^&+=!*_\\-.?/(){}\\[\\]:;,<>~`|]");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // Let @NotBlank / @Size own blank/length errors — this validator
        // only judges character composition, and treats blank as "not its
        // problem" (valid) so error messages don't pile up on an empty field.
        if (value == null || value.isBlank()) {
            return true;
        }
        return HAS_LETTER.matcher(value).find()
                && HAS_DIGIT.matcher(value).find()
                && HAS_SPECIAL.matcher(value).find();
    }
}
