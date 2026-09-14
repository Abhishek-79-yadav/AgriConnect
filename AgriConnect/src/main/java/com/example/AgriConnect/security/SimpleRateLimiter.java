package com.example.AgriConnect.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SimpleRateLimiter {

    private final Map<String, RequestInfo> requests = new ConcurrentHashMap<>();

    private static final int LIMIT = 5; // 5 requests
    private static final long TIME_WINDOW = 60_000; // 1 minute

    public boolean isAllowed(String ip) {

        RequestInfo info = requests.getOrDefault(ip,
                new RequestInfo(0, Instant.now().toEpochMilli()));

        long now = Instant.now().toEpochMilli();

        if (now - info.timestamp > TIME_WINDOW) {
            info = new RequestInfo(0, now);
        }

        if (info.count >= LIMIT) {
            return false;
        }

        info.count++;
        requests.put(ip, info);

        return true;
    }

    static class RequestInfo {
        int count;
        long timestamp;

        RequestInfo(int count, long timestamp) {
            this.count = count;
            this.timestamp = timestamp;
        }
    }
}