package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.SubscriptionResponse;
import com.example.AgriConnect.entity.Plan;
import com.example.AgriConnect.entity.Subscription;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.PlanRepository;
import com.example.AgriConnect.repository.SubscriptionRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepo;
    private final PlanRepository planRepo;
    private final UserRepository userRepo;

    /**
     * Starts a new subscription for the logged-in user.
     *
     * NOTE — payment is not yet wired up here: this activates the
     * subscription immediately on call. Before charging real money, this
     * needs to create a Razorpay order first (same pattern as
     * OrderService.checkout()) and only activate the subscription once
     * PaymentService confirms the payment, the same way orders wait for
     * verifyPayment(). Flagging this rather than silently shipping a
     * "free" paywall.
     */
    public SubscriptionResponse subscribe(String email, Long planId) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        Plan plan = planRepo.findById(planId)
                .orElseThrow(() -> new ApiException("Plan not found"));

        LocalDate start = LocalDate.now();
        LocalDate end = start.plusDays(plan.getDurationDays());

        Subscription sub = Subscription.builder()
                .user(user)
                .plan(plan)
                .startDate(start)
                .endDate(end)
                .active(true)
                .build();

        return toResponse(subscriptionRepo.save(sub));
    }

    public List<SubscriptionResponse> getMySubscriptions(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        return subscriptionRepo.findByUserIdOrderByEndDateDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public boolean hasActiveSubscription(Long userId) {
        return subscriptionRepo
                .findFirstByUserIdAndActiveTrueAndEndDateGreaterThanEqualOrderByEndDateDesc(userId, LocalDate.now())
                .isPresent();
    }

    /** Throws if the user doesn't have a currently-valid plan. */
    public void requireActiveSubscription(Long userId) {
        if (!hasActiveSubscription(userId)) {
            throw new ApiException("An active plan is required to access the agri-input marketplace. Please subscribe first.");
        }
    }

    private SubscriptionResponse toResponse(Subscription s) {
        boolean valid = s.isActive() && !s.getEndDate().isBefore(LocalDate.now());
        return SubscriptionResponse.builder()
                .id(s.getId())
                .planName(s.getPlan().getName())
                .planTier(s.getPlan().getTier().name())
                .startDate(s.getStartDate())
                .endDate(s.getEndDate())
                .active(s.isActive())
                .currentlyValid(valid)
                .build();
    }
}
