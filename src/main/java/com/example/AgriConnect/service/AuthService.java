package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.RegisterRequest;
import com.example.AgriConnect.dto.request.RegisterBrandRequest;
import com.example.AgriConnect.dto.request.LoginRequest;
import com.example.AgriConnect.dto.response.AuthResponse;
import com.example.AgriConnect.dto.response.UserResponse;
import com.example.AgriConnect.entity.BrandProfile;
import com.example.AgriConnect.entity.RefreshToken;
import com.example.AgriConnect.entity.Role;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.BrandProfileRepository;
import com.example.AgriConnect.repository.PasswordResetOtpRepository;
import com.example.AgriConnect.repository.RefreshTokenRepository;
import com.example.AgriConnect.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.AgriConnect.entity.PasswordResetOtp;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repo;
    private final PasswordResetOtpRepository otpRepo;
    private final RefreshTokenRepository refreshTokenRepo;
    private final TokenBlacklistService tokenBlacklistService;
    private final BrandProfileRepository brandProfileRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final EmailService emailService;
    private final EmailVerificationService emailVerificationService;

    @org.springframework.beans.factory.annotation.Value("${app.super-admin-setup-key}")
    private String superAdminSetupKey;

    // Roles a person is allowed to pick for themselves on public /api/auth/register.
    // ADMIN accounts must be created through a separate, protected admin-only
    // flow — never from an unauthenticated endpoint. BRAND has its OWN
    // dedicated endpoint (registerBrand, below) since it needs extra company
    // fields and starts disabled pending admin approval.
    // Cryptographically secure RNG for OTP generation — java.util.Random /
    // Math.random() are predictable and not safe for anything security-sensitive.
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private static final Set<Role> SELF_REGISTERABLE_ROLES = Set.of(Role.FARMER, Role.BUYER);

    // Emails are case-insensitive by convention (RFC 5321 technically
    // allows a case-sensitive local part, but no mainstream provider
    // actually treats "User@x.com" and "user@x.com" as different mailboxes).
    // Without normalizing, the same person could accidentally end up with
    // two accounts differing only in case, or — depending on the DB
    // collation — face inconsistent login/lookup behavior. Applied at
    // every entry point below so it can't be bypassed via whichever
    // endpoint happens to skip it.
    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    public AuthResponse register(RegisterRequest req) {

        req.setEmail(normalizeEmail(req.getEmail()));

        if (repo.findByEmail(req.getEmail()).isPresent()) {
            throw new ApiException("Email already exists");
        }

        Role requestedRole = req.getRole() != null ? req.getRole() : Role.BUYER;

        if (!SELF_REGISTERABLE_ROLES.contains(requestedRole)) {
            throw new ApiException("Cannot self-register with role " + requestedRole
                    + ". Only FARMER or BUYER accounts can be created here.");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .mobile(req.getMobile())
                .role(requestedRole)
                .build();

        repo.save(user);

        // Best-effort — a mail server hiccup shouldn't block account
        // creation or force a retry of the whole registration. The user
        // can always trigger a resend later via /auth/resend-verification.
        try {
            emailVerificationService.sendVerification(user);
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(AuthService.class)
                    .warn("Could not send verification email to {}: {}", user.getEmail(), e.getMessage());
        }

        return issueTokens(user);
    }

    /**
     * Company (BRAND) self-registration. Unlike FARMER/BUYER, a new BRAND
     * account is created disabled (enabled=false) and can't log in until an
     * admin approves it — see login() below and AdminController's
     * approve-brand endpoint. No tokens are issued here since the account
     * isn't usable yet.
     */
    public void registerBrand(RegisterBrandRequest req) {

        req.setEmail(normalizeEmail(req.getEmail()));

        if (repo.findByEmail(req.getEmail()).isPresent()) {
            throw new ApiException("Email already exists");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .mobile(req.getMobile())
                .city(req.getCity())
                .state(req.getState())
                .role(Role.BRAND)
                .enabled(false)
                .build();

        repo.save(user);

        brandProfileRepo.save(BrandProfile.builder()
                .user(user)
                .companyName(req.getCompanyName())
                .gstNumber(req.getGstNumber())
                .category(req.getCategory())
                .build());
    }

    /**
     * Admin self-registration. Same pending-approval pattern as
     * registerBrand: account is created disabled, and only a SUPER_ADMIN
     * can approve it (see SuperAdminController.approveAdmin). Prevents
     * anyone who finds /register-admin from getting real admin access
     * without a super admin explicitly signing off.
     */
    public void registerAdmin(com.example.AgriConnect.dto.request.CreateAdminRequest req) {

        req.setEmail(normalizeEmail(req.getEmail()));

        if (repo.findByEmail(req.getEmail()).isPresent()) {
            throw new ApiException("Email already exists");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .role(Role.ADMIN)
                .enabled(false)
                .build();

        repo.save(user);
    }

    /**
     * One-time creation of the first SUPER_ADMIN account. Guarded two ways:
     * the caller must know app.super-admin-setup-key (an env var, not
     * committed to source), AND this only works while zero SUPER_ADMINs
     * exist yet — so even a leaked key is useless after the first run.
     * Change your password immediately after the first login.
     */
    public void bootstrapSuperAdmin(com.example.AgriConnect.dto.request.BootstrapSuperAdminRequest req) {

        req.setEmail(normalizeEmail(req.getEmail()));

        if (superAdminSetupKey == null || superAdminSetupKey.isBlank()
                || req.getSetupKey() == null
                || !java.security.MessageDigest.isEqual(
                        superAdminSetupKey.getBytes(java.nio.charset.StandardCharsets.UTF_8),
                        req.getSetupKey().getBytes(java.nio.charset.StandardCharsets.UTF_8))) {
            throw new ApiException("Invalid setup key");
        }

        if (repo.findAll().stream().anyMatch(u -> u.getRole() == Role.SUPER_ADMIN)) {
            throw new ApiException("A super admin already exists — use the admin panel to create further admins");
        }

        if (repo.findByEmail(req.getEmail()).isPresent()) {
            throw new ApiException("Email already exists");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .role(Role.SUPER_ADMIN)
                .build();

        repo.save(user);
    }

    public UserResponse getProfile(String email){

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .role(user.getRole().name())
                .city(user.getCity())
                .state(user.getState())
                .emailVerified(user.isEmailVerified())
                .build();
    }

    public AuthResponse login(LoginRequest req) {

        req.setEmail(normalizeEmail(req.getEmail()));

        // Same generic message whether the email doesn't exist or the password is
        // wrong, so a caller can't use this endpoint to discover which emails are
        // registered (user enumeration).
        User user = repo.findByEmail(req.getEmail())
                .orElseThrow(() -> new ApiException("Invalid email or password"));

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            if (user.getDeletionRequestedAt() != null) {
                throw new ApiException("This account has been deleted.");
            }
            if (user.getSuspensionReason() != null) {
                throw new ApiException("Your account has been suspended: " + user.getSuspensionReason());
            }
            if (user.getDeactivatedAt() != null) {
                // Self-deactivation is reversible: a correct password is
                // proof enough that this is genuinely the account owner
                // coming back, so reactivate right here instead of making
                // them go through a separate "reactivate" step.
                user.setEnabled(true);
                user.setDeactivatedAt(null);
                repo.save(user);
                return issueTokens(user);
            }
            if (user.getRole() == Role.BRAND) {
                throw new ApiException("Your company account is pending admin approval");
            }
            if (user.getRole() == Role.ADMIN) {
                throw new ApiException("Your admin account is pending super admin approval");
            }
            throw new ApiException("Your account has been disabled. Contact support.");
        }

        return issueTokens(user);
    }

    /**
     * Generates a fresh access+refresh token pair for the user, persists the refresh
     * token (replacing any previous one for that email so old refresh tokens stop
     * working after a new login), and returns them wrapped in AuthResponse.
     */
    private AuthResponse issueTokens(User user) {

        String accessToken = jwt.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwt.generateRefreshToken(user.getEmail());

        refreshTokenRepo.deleteByEmail(user.getEmail());

        RefreshToken tokenRecord = new RefreshToken();
        tokenRecord.setToken(refreshToken);
        tokenRecord.setEmail(user.getEmail());
        tokenRecord.setExpiryDate(jwt.extractExpiry(refreshToken));
        refreshTokenRepo.save(tokenRecord);

        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getEmail(),
                user.getRole().name(),
                user.getId()
        );
    }

    /**
     * Exchanges a valid, non-blacklisted, DB-registered refresh token for a new
     * access token. Rotates the refresh token too (old one is invalidated) so a
     * leaked refresh token has a short window of usefulness.
     */
    public AuthResponse refreshToken(String refreshToken) {

        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ApiException("Refresh token is required");
        }

        if (tokenBlacklistService.isBlacklisted(refreshToken)) {
            throw new ApiException("Refresh token has been revoked");
        }

        if (!jwt.isValidRefreshToken(refreshToken)) {
            throw new ApiException("Invalid or expired refresh token");
        }

        RefreshToken storedToken = refreshTokenRepo.findByToken(refreshToken)
                .orElseThrow(() -> new ApiException("Refresh token not recognized"));

        if (storedToken.getExpiryDate().before(new Date())) {
            refreshTokenRepo.deleteByEmail(storedToken.getEmail());
            throw new ApiException("Refresh token expired, please login again");
        }

        User user = repo.findByEmail(storedToken.getEmail())
                .orElseThrow(() -> new ApiException("User not found"));

        // Rotate: old refresh token can never be reused again.
        tokenBlacklistService.blacklist(refreshToken);

        return issueTokens(user);
    }

    /**
     * Logs the user out by blacklisting the current access token (so it can't be
     * reused for the rest of its natural lifetime) and revoking their refresh token.
     */
    public void logout(String accessToken, String refreshToken) {

        if (accessToken != null && !accessToken.isBlank()) {
            tokenBlacklistService.blacklist(accessToken);
        }

        if (refreshToken != null && !refreshToken.isBlank()) {
            tokenBlacklistService.blacklist(refreshToken);
            refreshTokenRepo.findByToken(refreshToken)
                    .ifPresent(t -> refreshTokenRepo.deleteByEmail(t.getEmail()));
        }
    }

    // Deliberately does NOT throw/reveal whether the email exists — an
    // asymmetric response here (error for "not found" vs success for
    // "found") is exactly what lets an attacker enumerate which emails
    // are registered on the platform. The response is identical either
    // way; if the account exists, an OTP quietly goes out, otherwise
    // nothing happens but the caller can't tell the difference.
    public void forgotPassword(String email) {

        email = normalizeEmail(email);

        java.util.Optional<User> userOpt = repo.findByEmail(email);
        if (userOpt.isEmpty()) {
            return;
        }

        // Drop any previous OTP for this email first, so unused/expired rows
        // don't just keep piling up in the table on every retry.
        otpRepo.deleteByEmail(email);

        // SecureRandom instead of Math.random() — this OTP guards password resets,
        // so it needs to be non-predictable.
        String otp = String.valueOf(100000 + SECURE_RANDOM.nextInt(900000));

        PasswordResetOtp resetOtp =
                PasswordResetOtp.builder()
                        .email(email)
                        .otp(otp)
                        .expiryTime(
                                LocalDateTime.now().plusMinutes(5)
                        )
                        .used(false)
                        .build();

        otpRepo.save(resetOtp);

        emailService.sendPasswordResetMail(
                email,
                otp
        );
    }

    public void resetPassword(
            String email,
            String otp,
            String newPassword
    ) {

        email = normalizeEmail(email);

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        PasswordResetOtp resetOtp =
                otpRepo.findByEmailAndOtp(email, otp)
                        .orElseThrow(
                                () -> new ApiException("Invalid OTP")
                        );

        if(resetOtp.isUsed()) {
            throw new ApiException("OTP already used");
        }

        if(resetOtp.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new ApiException("OTP Expired");
        }

        user.setPassword(
                encoder.encode(newPassword)
        );

        repo.save(user);

        resetOtp.setUsed(true);

        otpRepo.save(resetOtp);

        // Password just changed — kill any existing session for this account so a
        // refresh token issued before the reset (e.g. to whoever compromised the
        // account) stops working immediately.
        refreshTokenRepo.deleteByEmail(email);
    }
}