package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.SupportTicketRequest;
import com.example.AgriConnect.dto.response.SupportTicketResponse;
import com.example.AgriConnect.entity.SupportTicket;
import com.example.AgriConnect.entity.SupportTicketStatus;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.SupportTicketRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportTicketService {

    private final SupportTicketRepository supportTicketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public SupportTicketResponse create(String email, SupportTicketRequest request) {

        User user = getUser(email);

        SupportTicket ticket = SupportTicket.builder()
                .user(user)
                .category(request.getCategory())
                .subject(request.getSubject())
                .message(request.getMessage())
                .status(SupportTicketStatus.OPEN)
                .build();

        SupportTicket saved = supportTicketRepository.save(ticket);

        return mapToResponse(saved);
    }

    public List<SupportTicketResponse> getMine(String email) {
        User user = getUser(email);
        return supportTicketRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::mapToResponse).toList();
    }

    public List<SupportTicketResponse> getAll() {
        return supportTicketRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public SupportTicketResponse resolve(Long ticketId, String adminResponse) {

        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Support ticket not found"));

        if (ticket.getStatus() == SupportTicketStatus.RESOLVED) {
            throw new ApiException("This ticket is already resolved");
        }

        ticket.setStatus(SupportTicketStatus.RESOLVED);
        ticket.setAdminResponse(adminResponse);
        ticket.setResolvedAt(LocalDateTime.now());

        SupportTicket saved = supportTicketRepository.save(ticket);

        notificationService.createNotification(saved.getUser(),
                "Your support ticket \"" + saved.getSubject() + "\" has been resolved.");

        return mapToResponse(saved);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private SupportTicketResponse mapToResponse(SupportTicket t) {
        return SupportTicketResponse.builder()
                .id(t.getId())
                .userName(t.getUser().getName())
                .userEmail(t.getUser().getEmail())
                .category(t.getCategory())
                .subject(t.getSubject())
                .message(t.getMessage())
                .status(t.getStatus().name())
                .adminResponse(t.getAdminResponse())
                .createdAt(t.getCreatedAt())
                .resolvedAt(t.getResolvedAt())
                .build();
    }
}
