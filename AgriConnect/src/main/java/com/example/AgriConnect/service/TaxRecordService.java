package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.TaxRecordRequest;
import com.example.AgriConnect.dto.response.TaxRecordResponse;
import com.example.AgriConnect.entity.TaxRecord;
import com.example.AgriConnect.entity.TaxRecordStatus;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.TaxRecordRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaxRecordService {

    private final TaxRecordRepository taxRecordRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // GOVERNMENT creates a tax record against a farmer or brand account.
    @Transactional
    public TaxRecordResponse create(String governmentEmail, TaxRecordRequest request) {

        User official = getUser(governmentEmail);

        User target = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TaxRecord record = TaxRecord.builder()
                .user(target)
                .period(request.getPeriod())
                .taxableAmount(request.getTaxableAmount())
                .taxAmount(request.getTaxAmount())
                .taxType(request.getTaxType() != null && !request.getTaxType().isBlank()
                        ? request.getTaxType() : "GST")
                .status(TaxRecordStatus.PENDING)
                .dueDate(request.getDueDate())
                .remarks(request.getRemarks())
                .createdBy(official)
                .build();

        TaxRecord saved = taxRecordRepository.save(record);

        notificationService.createNotification(target,
                "A " + saved.getTaxType() + " record for " + saved.getPeriod()
                        + " (₹" + saved.getTaxAmount() + ") has been added to your account.");

        return mapToResponse(saved);
    }

    @Transactional
    public TaxRecordResponse updateStatus(Long id, String statusValue, String remarks) {

        TaxRecord record = getRecord(id);
        TaxRecordStatus newStatus;
        try {
            newStatus = TaxRecordStatus.valueOf(statusValue.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid tax record status: " + statusValue);
        }

        record.setStatus(newStatus);
        if (remarks != null) {
            record.setRemarks(remarks);
        }
        if (newStatus == TaxRecordStatus.PAID) {
            record.setPaidAt(LocalDateTime.now());
        }

        TaxRecord saved = taxRecordRepository.save(record);

        if (newStatus == TaxRecordStatus.PAID) {
            notificationService.createNotification(saved.getUser(),
                    "Your " + saved.getTaxType() + " record for " + saved.getPeriod() + " is marked paid.");
        }

        return mapToResponse(saved);
    }

    public List<TaxRecordResponse> getMine(String email) {
        User user = getUser(email);
        return taxRecordRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::mapToResponse).toList();
    }

    // GOVERNMENT — every record, across all users.
    public List<TaxRecordResponse> getAll() {
        return taxRecordRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).toList();
    }

    private TaxRecord getRecord(Long id) {
        return taxRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tax record not found"));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private TaxRecordResponse mapToResponse(TaxRecord t) {
        return TaxRecordResponse.builder()
                .id(t.getId())
                .userId(t.getUser().getId())
                .userName(t.getUser().getName())
                .userRole(t.getUser().getRole().name())
                .period(t.getPeriod())
                .taxableAmount(t.getTaxableAmount())
                .taxAmount(t.getTaxAmount())
                .taxType(t.getTaxType())
                .status(t.getStatus().name())
                .dueDate(t.getDueDate())
                .paidAt(t.getPaidAt())
                .remarks(t.getRemarks())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
