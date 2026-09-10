package com.example.AgriConnect.config;

import com.example.AgriConnect.service.JwtService;
import com.example.AgriConnect.service.MyUserDetailsService;
import com.example.AgriConnect.service.RateLimiterService;
import com.example.AgriConnect.service.TokenBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final MyUserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;
    private final RateLimiterService rateLimiterService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        return path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/actuator")
                || path.startsWith("/favicon.ico");
    }

    // Rate limiting keys on IP, so this must be the real client IP. Behind
    // any reverse proxy/load balancer (nginx, ALB, Cloudflare, Render,
    // Railway — i.e. basically every real deployment), request.getRemoteAddr()
    // returns the PROXY's IP for every request, which would put all users
    // in one shared rate-limit bucket. X-Forwarded-For carries the original
    // client IP instead — this assumes the deployment's edge proxy sets/
    // overwrites this header itself (standard for all of the above) rather
    // than passing through whatever a client sends, which would otherwise
    // make the rate limit trivially bypassable by spoofing the header.
    private String clientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }

        return request.getRemoteAddr();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        String ip = clientIp(request);

        // Rate Limiting only for Authentication APIs
        if (path.startsWith("/api/auth")
                && !rateLimiterService.isAllowed(ip)) {

            response.sendError(429, "Too many requests");
            return;
        }

        String authHeader = request.getHeader("Authorization");

        // No JWT
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        // Blacklisted Token
        if (tokenBlacklistService.isBlacklisted(token)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                    "Token has been revoked");
            return;
        }

        try {

            String email = jwtService.extractEmail(token);

            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                var userDetails =
                        userDetailsService.loadUserByUsername(email);

                if (jwtService.isValid(token, userDetails)) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities());

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request));

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (Exception ex) {

            log.error("JWT Authentication Failed", ex);

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or Expired Token");

            return;
        }

        filterChain.doFilter(request, response);
    }
}