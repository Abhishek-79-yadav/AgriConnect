package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.RiskFlagResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.repository.EmiInstallmentRepository;
import com.example.AgriConnect.repository.OrderRepository;
import com.example.AgriConnect.repository.RefundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RiskService {

    private final OrderRepository orderRepo;
    private final RefundRepository refundRepository;
    private final EmiInstallmentRepository emiInstallmentRepository;

    // Deliberately simple, explainable rules rather than a black-box score —
    // easy to extend with more rules later without changing the shape
    // callers rely on. Each rule below produces its own RiskFlagResponse
    // per user, so one user can carry more than one flag.
    private static final int CANCELLATION_THRESHOLD = 3;
    private static final int REFUND_THRESHOLD = 3;

    public List<RiskFlagResponse> getFlags() {
        List<RiskFlagResponse> flags = new ArrayList<>();
        flags.addAll(cancellationFlags());
        flags.addAll(refundAbuseFlags());
        flags.addAll(emiDefaultFlags());

        return flags.stream()
                .sorted((a, b) -> Long.compare(b.getMetricValue(), a.getMetricValue()))
                .toList();
    }

    // Buyers who cancel an unusually high number of orders — ties up
    // farmer stock and payment-processing overhead for nothing.
    private List<RiskFlagResponse> cancellationFlags() {
        List<Order> allOrders = orderRepo.findAll();

        Map<Long, List<Order>> cancelledByBuyerId = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.CANCELLED)
                .collect(Collectors.groupingBy(o -> o.getBuyer().getId()));

        return cancelledByBuyerId.entrySet().stream()
                .filter(e -> e.getValue().size() >= CANCELLATION_THRESHOLD)
                .map(e -> {
                    User buyer = e.getValue().get(0).getBuyer();
                    return RiskFlagResponse.builder()
                            .userId(buyer.getId())
                            .name(buyer.getName())
                            .email(buyer.getEmail())
                            .role(buyer.getRole().name())
                            .flagReason("High cancellation rate")
                            .metricValue(e.getValue().size())
                            .build();
                })
                .toList();
    }

    // Buyers with an unusually high number of completed refunds — could be
    // legitimate (bad luck with a few farmers) but worth a human look, since
    // it's also the classic "buy, use, return" abuse pattern.
    private List<RiskFlagResponse> refundAbuseFlags() {
        List<Refund> completed = refundRepository.findAll().stream()
                .filter(r -> r.getStatus() == RefundStatus.COMPLETED)
                .toList();

        Map<Long, List<Refund>> byBuyerId = completed.stream()
                .collect(Collectors.groupingBy(r -> r.getBuyer().getId()));

        return byBuyerId.entrySet().stream()
                .filter(e -> e.getValue().size() >= REFUND_THRESHOLD)
                .map(e -> {
                    User buyer = e.getValue().get(0).getBuyer();
                    return RiskFlagResponse.builder()
                            .userId(buyer.getId())
                            .name(buyer.getName())
                            .email(buyer.getEmail())
                            .role(buyer.getRole().name())
                            .flagReason("Frequent refunds")
                            .metricValue(e.getValue().size())
                            .build();
                })
                .toList();
    }

    // Buyers with EMI installments unpaid past their due date — a direct
    // credit-risk signal for anyone financing future orders for them.
    private List<RiskFlagResponse> emiDefaultFlags() {
        List<EmiInstallment> overdue = emiInstallmentRepository
                .findAllOverdue(EmiInstallmentStatus.PENDING, LocalDate.now());

        Map<Long, List<EmiInstallment>> byBuyerId = overdue.stream()
                .collect(Collectors.groupingBy(i -> i.getEmiPlan().getBuyer().getId()));

        return byBuyerId.entrySet().stream()
                .map(e -> {
                    User buyer = e.getValue().get(0).getEmiPlan().getBuyer();
                    return RiskFlagResponse.builder()
                            .userId(buyer.getId())
                            .name(buyer.getName())
                            .email(buyer.getEmail())
                            .role(buyer.getRole().name())
                            .flagReason("Overdue EMI installment(s)")
                            .metricValue(e.getValue().size())
                            .build();
                })
                .toList();
    }
}
