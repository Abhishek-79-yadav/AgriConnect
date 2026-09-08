package com.example.AgriConnect.config;

import com.example.AgriConnect.service.JwtService;
import com.example.AgriConnect.service.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.socket.config.annotation.*;

import java.security.Principal;

/**
 * The SockJS/STOMP handshake (HTTP GET /ws) is permitAll in SecurityConfig because
 * browsers can't attach a Bearer header to it. Real authentication instead happens
 * here, on the STOMP CONNECT frame itself, which *can* carry a custom Authorization
 * header set by the client's STOMP library (e.g. @stomp/stompjs connectHeaders).
 * Any CONNECT without a valid, non-blacklisted access token is rejected outright,
 * so an anonymous client can never subscribe to /topic/** and read notifications.
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig
        implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        registry.enableSimpleBroker("/topic");

        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/ws")

                .setAllowedOriginPatterns("*")

                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {

        registration.interceptors(new ChannelInterceptor() {

            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {

                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {

                    String authHeader = accessor.getFirstNativeHeader("Authorization");

                    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                        throw new BadCredentialsException("Missing token on STOMP CONNECT");
                    }

                    String token = authHeader.substring(7);

                    if (tokenBlacklistService.isBlacklisted(token)) {
                        throw new BadCredentialsException("Token has been revoked");
                    }

                    try {
                        String email = jwtService.extractEmail(token);

                        if (!"ACCESS".equals(jwtService.extractType(token))) {
                            throw new BadCredentialsException("Invalid token type");
                        }

                        Principal principal = () -> email;
                        accessor.setUser(principal);

                    } catch (BadCredentialsException e) {
                        throw e;
                    } catch (Exception e) {
                        throw new BadCredentialsException("Invalid or expired token");
                    }
                }

                return message;
            }
        });
    }
}