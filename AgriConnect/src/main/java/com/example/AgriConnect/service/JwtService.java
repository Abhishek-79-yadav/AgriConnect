package com.example.AgriConnect.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access.expiration}")
    private long accessExpiration;

    @Value("${jwt.refresh.expiration}")
    private long refreshExpiration;

    // HS256 needs a key of at least 256 bits (32 bytes). Without this check
    // a short/weak JWT_SECRET only fails the first time a token is signed —
    // deep into a request, with a cryptic jjwt exception. Fail at startup
    // instead, with a message that says exactly what's wrong.
    @PostConstruct
    private void validateSecret() {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "jwt.secret (JWT_SECRET) is not set. Refusing to start.");
        }
        if (secret.getBytes().length < 32) {
            throw new IllegalStateException(
                    "jwt.secret (JWT_SECRET) must be at least 32 characters (256 bits) for HS256. " +
                            "Generate one with: openssl rand -base64 32");
        }
    }

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // ---------------- ACCESS TOKEN ----------------
    public String generateAccessToken(String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .claim("type", "ACCESS")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessExpiration))
                .signWith(getKey())
                .compact();
    }

    // ---------------- REFRESH TOKEN ----------------
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim("type", "REFRESH")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(getKey())
                .compact();
    }

    // ---------------- EXTRACT ----------------
    public String extractEmail(String token) {
        return parse(token).getSubject();
    }

    public String extractRole(String token) {
        return parse(token).get("role", String.class);
    }

    public String extractType(String token) {
        return parse(token).get("type", String.class);
    }

    public Date extractExpiry(String token) {
        return parse(token).getExpiration();
    }

    // ---------------- VALIDATION ----------------
    public boolean isValid(String token, UserDetails userDetails) {
        String email = extractEmail(token);
        return email.equals(userDetails.getUsername())
                && !isExpired(token)
                && "ACCESS".equals(extractType(token));
    }

    // Used only by the /refresh flow — refresh tokens must never pass isValid() above,
    // otherwise they could be used directly as access tokens against any endpoint.
    public boolean isValidRefreshToken(String token) {
        try {
            return "REFRESH".equals(extractType(token)) && !isExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isExpired(String token) {
        return parse(token).getExpiration().before(new Date());
    }

    private Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}