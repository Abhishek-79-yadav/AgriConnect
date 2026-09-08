package com.example.AgriConnect.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private final StringRedisTemplate redisTemplate;

    private static final int LIMIT = 10;
    private static final long WINDOW = 60;

    // INCR is atomic in Redis, so this is race-free even under concurrent
    // requests from the same key — the previous get-then-conditionally-set
    // implementation had a window where two simultaneous requests could
    // both read the same count and both be let through past the limit.
    public boolean isAllowed(String key) {

        try {
            String redisKey = "rate:" + key;
            Long count = redisTemplate.opsForValue().increment(redisKey);

            if (count == null) {
                return true;
            }

            if (count == 1L) {
                redisTemplate.expire(redisKey, Duration.ofSeconds(WINDOW));
            }

            return count <= LIMIT;

        } catch (Exception e) {

            // Redis unavailable -> allow request
            return true;
        }
    }
}