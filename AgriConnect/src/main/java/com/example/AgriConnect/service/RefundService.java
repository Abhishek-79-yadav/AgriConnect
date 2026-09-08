package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.RefundResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.RefundRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

// Refunds settle into the buyer's Wallet — see the note on Refund for why
// (no live payment-gateway refund integration). initiateRefund() both
// records the refund and immediately completes it; kept as two steps
// (INITIATED -> COMPLETED) rather than one so the audit trail distinguishes
// "we owe this" from "this has actually moved", even though today they
// happen in the same transaction.
@Service
@RequiredArgsConstructor
public class RefundService {

    private final RefundRepository refundRepository;
    private final WalletService walletService;
    private final UserRepository userRepository;

    @Transactional
    public Refund initiateRefund(Order order, OrderItem orderItem, double amount, String reason) {

        Refund refund = Refund.builder()
                .order(order)
                .orderItem(orderItem)
                .buyer(order.getBuyer())
                .amount(amount)
                .reason(reason)
                .status(RefundStatus.INITIATED)
                .method("WALLET")
                .build();

        Refund saved = refundRepository.save(refund);

        walletService.credit(order.getBuyer(), amount, reason, "REFUND", saved.getId());

        saved.setStatus(RefundStatus.COMPLETED);
        saved.setCompletedAt(LocalDateTime.now());

        return refundRepository.save(saved);
    }

    public List<RefundResponse> getBuyerRefunds(String email) {
        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return refundRepository.findByBuyer_IdOrderByCreatedAtDesc(buyer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    public List<RefundResponse> getAllRefunds(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() != Role.ADMIN && user.getRole() != Role.SUPER_ADMIN) {
            throw new com.example.AgriConnect.exception.ApiException("Admin access required");
        }
        return refundRepository.findAll()
                .stream().map(this::mapToResponse).toList();
    }

    private RefundResponse mapToResponse(Refund r) {
        return RefundResponse.builder()
                .id(r.getId())
                .orderId(r.getOrder().getId())
                .orderItemId(r.getOrderItem() != null ? r.getOrderItem().getId() : null)
                .buyerName(r.getBuyer().getName())
                .amount(r.getAmount())
                .reason(r.getReason())
                .status(r.getStatus().name())
                .method(r.getMethod())
                .createdAt(r.getCreatedAt())
                .completedAt(r.getCompletedAt())
                .build();
    }
}
