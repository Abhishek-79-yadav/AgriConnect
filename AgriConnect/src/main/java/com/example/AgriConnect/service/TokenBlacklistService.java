package com.example.AgriConnect.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Date;

/**
 * Previously an in-memory ConcurrentHashMap. That meant:
 *   1) a restart silently un-revoked every logged-out token until it naturally expired,
 *   2) with more than one app instance, logging out on instance A didn't block the
 *      token on instance B,
 *   3) the set only ever grew — nothing was evicted, so it leaked memory over time.
 *
 * Backed by Redis now (already a project dependency via RateLimiterService), with a
 * TTL matching the token's own remaining lifetime, so entries clean themselves up
 * and every instance sees the same blacklist.
 */
@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private static final String PREFIX = "blacklist:";

    private final StringRedisTemplate redisTemplate;
    private final JwtService jwtService;

    public void blacklist(String token) {

        long ttlMillis;
        try {
            Date expiry = jwtService.extractExpiry(token);
            ttlMillis = expiry.getTime() - System.currentTimeMillis();
        } catch (Exception e) {
            // Malformed/unparseable token — still worth blocking for a safe default window.
            ttlMillis = Duration.ofHours(1).toMillis();
        }

        if (ttlMillis <= 0) {
            return; // already expired, nothing to blacklist
        }

        redisTemplate.opsForValue().set(
                PREFIX + token,
                "1",
                Duration.ofMillis(ttlMillis)
        );
    }

    public boolean isBlacklisted(String token) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(PREFIX + token));
        } catch (Exception e) {
            // Redis unavailable: fail closed for blacklist checks would lock everyone
            // out, so we fail open here consistent with RateLimiterService's own
            // "Redis down -> allow" behavior. Log this in production monitoring.
            return false;
        }
    }
}