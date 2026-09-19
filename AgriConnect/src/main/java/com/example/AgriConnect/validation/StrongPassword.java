package com.example.AgriConnect.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

// Requires at least one letter, one digit, and one special character, on
// top of whatever @Size already enforces for length. Applied everywhere a
// password is set or changed (registration, brand registration, change
// password, reset password) so the rule can't be bypassed by going
// through a different endpoint than the one someone happened to test.
@Documented
@Constraint(validatedBy = StrongPasswordValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface StrongPassword {

    String message() default "Password must contain at least one letter, one number, and one special character (e.g. @, #, $, !)";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
