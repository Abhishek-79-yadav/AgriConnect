package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.DisputeRequest;
import com.example.AgriConnect.dto.response.DisputeResponse;
import com.example.AgriConnect.entity.Dispute;
import com.example.AgriConnect.entity.DisputeStatus;
import com.example.AgriConnect.entity.Order;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.DisputeRepository;
import com.example.AgriConnect.repository.OrderRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DisputeService {

    private final DisputeRepository disputeRepo;
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;

    public DisputeResponse file(String buyerEmail, DisputeRequest request) {
        User buyer = userRepo.findByEmail(buyerEmail)
                .orElseThrow(() -> new ApiException("User not found"));

        Order order = orderRepo.findById(request.getOrderId())
                .orElseThrow(() -> new ApiException("Order not found"));

        if (!order.getBuyer().getId().equals(buyer.getId())) {
            throw new ApiException("You can only raise a dispute on your own order");
        }

        Dispute dispute = Dispute.builder()
                .order(order)
                .buyer(buyer)
                .reason(request.getReason())
                .description(request.getDescription())
                .status(DisputeStatus.OPEN)
                .build();

        return toResponse(disputeRepo.save(dispute));
    }

    public List<DisputeResponse> getMine(String buyerEmail) {
        User buyer = userRepo.findByEmail(buyerEmail)
                .orElseThrow(() -> new ApiException("User not found"));

        return disputeRepo.findByBuyerId(buyer.getId()).stream().map(this::toResponse).toList();
    }

    public List<DisputeResponse> getAll() {
        return disputeRepo.findAll().stream().map(this::toResponse).toList();
    }

    public DisputeResponse resolve(Long id, String status, String adminResponse) {
        Dispute dispute = disputeRepo.findById(id)
                .orElseThrow(() -> new ApiException("Dispute not found"));

        DisputeStatus newStatus;
        try {
            newStatus = DisputeStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid status — use RESOLVED or REJECTED");
        }

        dispute.setStatus(newStatus);
        dispute.setAdminResponse(adminResponse);
        dispute.setResolvedAt(LocalDateTime.now());

        return toResponse(disputeRepo.save(dispute));
    }

    private DisputeResponse toResponse(Dispute d) {
        return DisputeResponse.builder()
                .id(d.getId())
                .orderId(d.getOrder().getId())
                .buyerName(d.getBuyer().getName())
                .buyerEmail(d.getBuyer().getEmail())
                .reason(d.getReason())
                .description(d.getDescription())
                .status(d.getStatus().name())
                .adminResponse(d.getAdminResponse())
                .createdAt(d.getCreatedAt())
                .resolvedAt(d.getResolvedAt())
                .build();
    }
}
