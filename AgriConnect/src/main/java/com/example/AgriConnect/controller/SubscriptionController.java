package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.SubscriptionResponse;
import com.example.AgriConnect.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/subscribe/{planId}")
    public SubscriptionResponse subscribe(@PathVariable Long planId, Authentication auth) {
        return subscriptionService.subscribe(auth.getName(), planId);
    }

    @GetMapping("/me")
    public List<SubscriptionResponse> mySubscriptions(Authentication auth) {
        return subscriptionService.getMySubscriptions(auth.getName());
    }
}
