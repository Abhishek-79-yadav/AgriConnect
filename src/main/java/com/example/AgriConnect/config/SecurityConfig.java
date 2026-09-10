package com.example.AgriConnect.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;
import java.util.List;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    // Was previously hardcoded in corsConfigurationSource(), which meant the
    // cors.allowed-origins env var in application.properties was silently
    // ignored — staging/prod deployments could never override it without a
    // code change. Now driven entirely by config.
    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // Must come before the blanket /api/auth/** permitAll
                        // below — Spring Security uses the first matching
                        // rule, so a more specific path has to be declared
                        // earlier to actually take effect. Without this,
                        // resend-verification would be reachable with no
                        // Authentication at all, and Authentication.getName()
                        // in the controller would NPE instead of 401ing.
                        .requestMatchers("/api/auth/resend-verification").authenticated()

                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/crops/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/buyer/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews/product/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/plans").permitAll()
                        .requestMatchers("/api/campaigns/**").permitAll()
                        // PhonePe calls this server-to-server with no JWT — the
                        // X-VERIFY checksum inside PhonePeService is what actually
                        // authenticates it, not Spring Security's role check.
                        .requestMatchers(HttpMethod.POST, "/api/buyer/payment/phonepe/callback").permitAll()

                        .requestMatchers("/api/buyer/**").hasRole("BUYER")
                        .requestMatchers(HttpMethod.GET, "/api/farmer/agri-input-ads").permitAll()
                        .requestMatchers("/api/farmer/**").hasRole("FARMER")
                        .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/super-admin/**").hasRole("SUPER_ADMIN")

                        // Government: reviews/cancels warehouse licenses and
                        // manages tax records. Schemes stay shared with
                        // ADMIN/SUPER_ADMIN below.
                        .requestMatchers(HttpMethod.GET, "/api/warehouse-licenses").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/warehouse-licenses/*/approve").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/warehouse-licenses/*/reject").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/warehouse-licenses/*/cancel").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/warehouse-licenses/*/suspend").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/warehouse-licenses/*/resume").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/warehouse-licenses/*/renew").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/warehouse-licenses").hasRole("FARMER")
                        .requestMatchers(HttpMethod.GET, "/api/warehouse-licenses/mine").hasRole("FARMER")

                        .requestMatchers(HttpMethod.GET, "/api/tax-records").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/tax-records").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/tax-records/*/status").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/tax-records/mine").hasAnyRole("FARMER", "BRAND")

                        // Quality & Warehouse Receipt — farmer requests a
                        // receipt for stored produce; government/admin
                        // inspects and grades it. Same reviewer roles as
                        // warehouse-licenses above.
                        .requestMatchers(HttpMethod.POST, "/api/warehouse-receipts").hasRole("FARMER")
                        .requestMatchers(HttpMethod.GET, "/api/warehouse-receipts/mine").hasRole("FARMER")
                        .requestMatchers(HttpMethod.PUT, "/api/warehouse-receipts/*/withdraw").hasAnyRole("FARMER", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/warehouse-receipts/*/inspect").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/warehouse-receipts/pending").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/warehouse-receipts").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")

                        // Public reference/browse endpoints — anyone can look
                        // these up, no role restriction needed.
                        .requestMatchers(HttpMethod.GET, "/api/departments/active").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/notices/active").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tax-config/active").permitAll()

                        // Government module — departments, notices, tax
                        // config, reports, and the audit trail are all
                        // GOVERNMENT/ADMIN/SUPER_ADMIN territory.
                        .requestMatchers("/api/government/**").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")

                        // Scheme applications: farmer applies and reads their
                        // own; government reviews everyone's.
                        .requestMatchers(HttpMethod.POST, "/api/scheme-applications").hasRole("FARMER")
                        .requestMatchers(HttpMethod.GET, "/api/scheme-applications/mine").hasRole("FARMER")
                        .requestMatchers(HttpMethod.GET, "/api/scheme-applications").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/scheme-applications/*/verify-documents").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/scheme-applications/*/decision").hasAnyRole("GOVERNMENT", "ADMIN", "SUPER_ADMIN")

                        .requestMatchers("/api/brand/**").hasRole("BRAND")
                        .requestMatchers("/api/wishlist/**")
                        .hasAnyRole("BUYER","FARMER")
                        .requestMatchers("/api/search/**").permitAll()
                        .requestMatchers(HttpMethod.POST,
                                "/api/coupon")
                        .hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/schemes/admin/**")
                        .hasAnyRole("ADMIN", "SUPER_ADMIN", "GOVERNMENT")
                        .requestMatchers("/api/cloudinary/**")
                        .hasAnyRole("FARMER","ADMIN","SUPER_ADMIN")

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Uptime monitors / load-balancer health checks hit this
                        // unauthenticated — without this rule it 401s (the only
                        // actuator endpoint exposed is health,info, both harmless
                        // to expose; see management.endpoints.web.exposure.include).
                        .requestMatchers("/actuator/health", "/actuator/health/**", "/actuator/info").permitAll()

                        .requestMatchers("/ws/**").permitAll()

                        .anyRequest().authenticated()
                )

                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                        .contentTypeOptions(content -> {})
                        .cacheControl(cache -> {})
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000)
                        )
                )

                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))
                        .accessDeniedHandler((request, response, accessDeniedException) ->
                                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied"))
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS CONFIG — now reads from cors.allowed-origins (comma separated),
    // e.g. cors.allowed-origins=https://agriconnect.com,https://admin.agriconnect.com
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // AUTH MANAGER
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}