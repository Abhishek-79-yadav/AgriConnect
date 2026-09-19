package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.EmiInstallmentResponse;
import com.example.AgriConnect.dto.response.EmiPlanResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

// Lets a buyer split an ONLINE order they haven't paid for yet into
// monthly installments instead of paying the whole thing up front. This
// is opt-in *before* payment (checkout() still creates the order as a
// normal unpaid ONLINE order) — choosing EMI here replaces the single
// Razorpay charge with a schedule, and clears the cart the same way a
// completed payment would, since the order is now committed to.
@Service
@RequiredArgsConstructor
public class EmiService {

    private final EmiPlanRepository emiPlanRepository;
    private final EmiInstallmentRepository emiInstallmentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final WalletService walletService;

    // Orders below this amount aren't worth financing — keeps installment
    // sizes meaningful and avoids ₹50 EMIs.
    private static final double MIN_EMI_ELIGIBLE_AMOUNT = 1000.0;

    @Transactional
    public EmiPlanResponse createPlan(Long orderId, Integer numberOfInstallments, String email) {

        User buyer = getUser(email);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getBuyer().getId().equals(buyer.getId())) {
            throw new ApiException("You can only set up EMI on your own order");
        }

        if (!"ONLINE".equalsIgnoreCase(order.getPaymentMethod())) {
            throw new ApiException("EMI is only available for online orders");
        }

        if (order.isPaid()) {
            throw new ApiException("This order is already paid");
        }

        if (order.getTotalPrice() < MIN_EMI_ELIGIBLE_AMOUNT) {
            throw new ApiException("Orders under ₹" + (int) MIN_EMI_ELIGIBLE_AMOUNT + " aren't eligible for EMI");
        }

        if (emiPlanRepository.findByOrder_Id(orderId).isPresent()) {
            throw new ApiException("An EMI plan already exists for this order");
        }

        if (numberOfInstallments == null || numberOfInstallments < 2 || numberOfInstallments > 12) {
            throw new ApiException("Number of installments must be between 2 and 12");
        }

        EmiPlan plan = EmiPlan.builder()
                .order(order)
                .buyer(buyer)
                .totalAmount(order.getTotalPrice())
                .numberOfInstallments(numberOfInstallments)
                .build();

        EmiPlan savedPlan = emiPlanRepository.save(plan);

        // Split evenly; fold any rounding remainder into the last
        // installment so the schedule sums exactly to the order total.
        double base = Math.floor((order.getTotalPrice() / numberOfInstallments) * 100) / 100.0;
        double allocated = base * (numberOfInstallments - 1);
        double lastAmount = Math.round((order.getTotalPrice() - allocated) * 100) / 100.0;

        List<EmiInstallment> installments = new ArrayList<>();
        for (int i = 1; i <= numberOfInstallments; i++) {
            installments.add(EmiInstallment.builder()
                    .emiPlan(savedPlan)
                    .installmentNumber(i)
                    .amount(i == numberOfInstallments ? lastAmount : base)
                    // First installment due immediately, rest monthly after.
                    .dueDate(LocalDate.now().plusMonths(i - 1))
                    .status(EmiInstallmentStatus.PENDING)
                    .build());
        }
        emiInstallmentRepository.saveAll(installments);
        savedPlan.setInstallments(installments);

        // The order was already committed to (and its cart rows cleared)
        // at checkout() time — EMI just replaces the single upfront
        // charge with a schedule, nothing left to clear in the cart here.
        if (order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
        }

        return mapToResponse(savedPlan, installments);
    }

    @Transactional
    public EmiInstallmentResponse payInstallment(Long installmentId, String email) {

        User buyer = getUser(email);

        EmiInstallment installment = emiInstallmentRepository.findById(installmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Installment not found"));

        EmiPlan plan = installment.getEmiPlan();

        if (!plan.getBuyer().getId().equals(buyer.getId())) {
            throw new ApiException("You can only pay your own installments");
        }

        if (installment.getStatus() == EmiInstallmentStatus.PAID) {
            throw new ApiException("This installment is already paid");
        }

        // Paid from the buyer's wallet — the same balance refunds and
        // other credits land in, so a refund can directly fund the next
        // installment without a round trip through a payment gateway.
        walletService.debit(buyer, installment.getAmount(),
                "EMI installment #" + installment.getInstallmentNumber() + " — order #" + plan.getOrder().getId(),
                "EMI_INSTALLMENT", installment.getId());

        installment.setStatus(EmiInstallmentStatus.PAID);
        installment.setPaidAt(java.time.LocalDateTime.now());
        EmiInstallment saved = emiInstallmentRepository.save(installment);

        List<EmiInstallment> all = emiInstallmentRepository.findByEmiPlan_IdOrderByInstallmentNumberAsc(plan.getId());
        boolean allPaid = all.stream().allMatch(i -> i.getStatus() == EmiInstallmentStatus.PAID);

        if (allPaid) {
            Order order = plan.getOrder();
            order.setPaid(true);
            if (order.getStatus() == OrderStatus.PENDING) {
                order.setStatus(OrderStatus.CONFIRMED);
            }
            orderRepository.save(order);
        }

        return toInstallmentResponse(saved);
    }

    public List<EmiPlanResponse> getBuyerPlans(String email) {
        User buyer = getUser(email);
        return emiPlanRepository.findByBuyer_Id(buyer.getId())
                .stream()
                .map(plan -> mapToResponse(plan,
                        emiInstallmentRepository.findByEmiPlan_IdOrderByInstallmentNumberAsc(plan.getId())))
                .toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private EmiPlanResponse mapToResponse(EmiPlan plan, List<EmiInstallment> installments) {
        return EmiPlanResponse.builder()
                .id(plan.getId())
                .orderId(plan.getOrder().getId())
                .totalAmount(plan.getTotalAmount())
                .numberOfInstallments(plan.getNumberOfInstallments())
                .createdAt(plan.getCreatedAt())
                .installments(installments.stream().map(this::toInstallmentResponse).toList())
                .build();
    }

    private EmiInstallmentResponse toInstallmentResponse(EmiInstallment i) {
        return EmiInstallmentResponse.builder()
                .id(i.getId())
                .installmentNumber(i.getInstallmentNumber())
                .amount(i.getAmount())
                .dueDate(i.getDueDate())
                .status(i.getStatus().name())
                .paidAt(i.getPaidAt())
                .build();
    }
}
