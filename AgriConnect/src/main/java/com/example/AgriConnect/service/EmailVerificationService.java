package com.example.AgriConnect.service;

import com.example.AgriConnect.entity.EmailVerificationToken;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.EmailVerificationRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

// Sending a verification email never blocks registration or login — an
// unverified account can still use the platform today (changing that is
// a real product decision with its own UX, not something to silently
// bake into this pass). This only makes verification possible and
// tracks whether it happened; enforcing it anywhere is a deliberate
// follow-up, not implied by this existing.
@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final EmailVerificationRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    // REQUIRES_NEW — deliberately its own transaction, separate from
    // whatever caller (e.g. AuthService.register) is in progress. If
    // email sending fails here, only this method's own DB work (the
    // token save) rolls back; it must NOT poison an outer transaction
    // like user registration, which the caller already wraps in a
    // try/catch expecting a failure here to be harmless.
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendVerification(User user) {

        // Replace any existing token for this user rather than piling up
        // rows — only the newest link should actually work.
        tokenRepository.findByUserId(user.getId())
                .ifPresent(tokenRepository::delete);

        EmailVerificationToken token = EmailVerificationToken.builder()
                .user(user)
                .build();

        EmailVerificationToken saved = tokenRepository.save(token);

        emailService.sendVerificationMail(user.getEmail(), saved.getToken());
    }

    @Transactional
    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isEmailVerified()) {
            throw new ApiException("This email is already verified");
        }

        sendVerification(user);
    }

    @Transactional
    public void verify(String token) {

        EmailVerificationToken record = tokenRepository.findByToken(token)
                .orElseThrow(() -> new ApiException("Invalid or expired verification link"));

        if (record.getExpiryTime().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(record);
            throw new ApiException("This verification link has expired — request a new one");
        }

        User user = record.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        tokenRepository.delete(record);
    }
}