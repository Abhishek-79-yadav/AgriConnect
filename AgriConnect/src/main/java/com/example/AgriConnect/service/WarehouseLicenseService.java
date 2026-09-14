package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.WarehouseLicenseRequest;
import com.example.AgriConnect.dto.response.WarehouseLicenseResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.UserRepository;
import com.example.AgriConnect.repository.WarehouseLicenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WarehouseLicenseService {

    private final WarehouseLicenseRepository licenseRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // FARMER applies for a new warehouse license.
    @Transactional
    public WarehouseLicenseResponse apply(String email, WarehouseLicenseRequest request) {

        User farmer = getUser(email);

        WarehouseLicense license = WarehouseLicense.builder()
                .farmer(farmer)
                .warehouseName(request.getWarehouseName())
                .location(request.getLocation())
                .capacityTonnes(request.getCapacityTonnes())
                .documentUrl(request.getDocumentUrl())
                .status(LicenseStatus.PENDING)
                .build();

        return mapToResponse(licenseRepository.save(license));
    }

    public List<WarehouseLicenseResponse> getMine(String email) {
        User farmer = getUser(email);
        return licenseRepository.findByFarmer_IdOrderByAppliedAtDesc(farmer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    // GOVERNMENT (or admin) — every application, any status.
    public List<WarehouseLicenseResponse> getAll() {
        return licenseRepository.findAllByOrderByAppliedAtDesc()
                .stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public WarehouseLicenseResponse approve(Long id, String reviewerEmail, java.time.LocalDate expiryDate) {

        User reviewer = getUser(reviewerEmail);
        WarehouseLicense license = getLicense(id);

        if (license.getStatus() == LicenseStatus.ACTIVE) {
            throw new ApiException("This license is already active");
        }

        // Human-readable but unique enough for a real license identifier
        // without needing a separate sequence table.
        license.setLicenseNumber("WL-" + LocalDateTime.now().getYear() + "-"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        license.setStatus(LicenseStatus.ACTIVE);
        license.setExpiryDate(expiryDate);
        license.setReviewedAt(LocalDateTime.now());
        license.setReviewedBy(reviewer);
        license.setRemarks(null);

        WarehouseLicense saved = licenseRepository.save(license);

        notificationService.createNotification(saved.getFarmer(),
                "Your warehouse license for \"" + saved.getWarehouseName() + "\" was approved (#" + saved.getLicenseNumber() + ").");

        return mapToResponse(saved);
    }

    @Transactional
    public WarehouseLicenseResponse reject(Long id, String reviewerEmail, String remarks) {
        return setTerminalStatus(id, reviewerEmail, LicenseStatus.REJECTED, remarks,
                "was not approved");
    }

    // Cancels a previously ACTIVE license — the "check and cancel" part
    // of what a government official does, distinct from rejecting a
    // still-pending application.
    @Transactional
    public WarehouseLicenseResponse cancel(Long id, String reviewerEmail, String remarks) {

        WarehouseLicense license = getLicense(id);
        if (license.getStatus() != LicenseStatus.ACTIVE && license.getStatus() != LicenseStatus.SUSPENDED) {
            throw new ApiException("Only an active or suspended license can be cancelled");
        }

        return setTerminalStatus(id, reviewerEmail, LicenseStatus.CANCELLED, remarks, "was cancelled");
    }

    // Temporary halt, short of a full cancellation — e.g. while an
    // inspection or complaint is being looked into. Reversible via resume().
    @Transactional
    public WarehouseLicenseResponse suspend(Long id, String reviewerEmail, String remarks) {

        WarehouseLicense license = getLicense(id);
        if (license.getStatus() != LicenseStatus.ACTIVE) {
            throw new ApiException("Only an active license can be suspended");
        }

        User reviewer = getUser(reviewerEmail);
        license.setStatus(LicenseStatus.SUSPENDED);
        license.setRemarks(remarks);
        license.setReviewedAt(LocalDateTime.now());
        license.setReviewedBy(reviewer);

        WarehouseLicense saved = licenseRepository.save(license);

        notificationService.createNotification(saved.getFarmer(),
                "Your warehouse license for \"" + saved.getWarehouseName() + "\" has been suspended"
                        + (remarks != null && !remarks.isBlank() ? ": " + remarks : "."));

        return mapToResponse(saved);
    }

    @Transactional
    public WarehouseLicenseResponse resume(Long id, String reviewerEmail) {

        WarehouseLicense license = getLicense(id);
        if (license.getStatus() != LicenseStatus.SUSPENDED) {
            throw new ApiException("Only a suspended license can be resumed");
        }

        User reviewer = getUser(reviewerEmail);
        license.setStatus(LicenseStatus.ACTIVE);
        license.setReviewedAt(LocalDateTime.now());
        license.setReviewedBy(reviewer);

        WarehouseLicense saved = licenseRepository.save(license);

        notificationService.createNotification(saved.getFarmer(),
                "Your warehouse license for \"" + saved.getWarehouseName() + "\" has been resumed.");

        return mapToResponse(saved);
    }

    // Extends an active (or recently expired) license's expiry date
    // without going through a fresh application.
    @Transactional
    public WarehouseLicenseResponse renew(Long id, String reviewerEmail, java.time.LocalDate newExpiryDate) {

        WarehouseLicense license = getLicense(id);
        if (license.getStatus() != LicenseStatus.ACTIVE && license.getStatus() != LicenseStatus.EXPIRED) {
            throw new ApiException("Only an active or expired license can be renewed");
        }
        if (newExpiryDate == null || !newExpiryDate.isAfter(java.time.LocalDate.now())) {
            throw new ApiException("New expiry date must be in the future");
        }

        User reviewer = getUser(reviewerEmail);
        license.setStatus(LicenseStatus.ACTIVE);
        license.setExpiryDate(newExpiryDate);
        license.setReviewedAt(LocalDateTime.now());
        license.setReviewedBy(reviewer);

        WarehouseLicense saved = licenseRepository.save(license);

        notificationService.createNotification(saved.getFarmer(),
                "Your warehouse license for \"" + saved.getWarehouseName() + "\" was renewed until "
                        + newExpiryDate + ".");

        return mapToResponse(saved);
    }

    private WarehouseLicenseResponse setTerminalStatus(Long id, String reviewerEmail, LicenseStatus status,
                                                         String remarks, String notificationVerb) {
        User reviewer = getUser(reviewerEmail);
        WarehouseLicense license = getLicense(id);

        license.setStatus(status);
        license.setRemarks(remarks);
        license.setReviewedAt(LocalDateTime.now());
        license.setReviewedBy(reviewer);

        WarehouseLicense saved = licenseRepository.save(license);

        notificationService.createNotification(saved.getFarmer(),
                "Your warehouse license for \"" + saved.getWarehouseName() + "\" " + notificationVerb
                        + (remarks != null && !remarks.isBlank() ? ": " + remarks : "."));

        return mapToResponse(saved);
    }

    private WarehouseLicense getLicense(Long id) {
        return licenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse license not found"));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private WarehouseLicenseResponse mapToResponse(WarehouseLicense l) {
        return WarehouseLicenseResponse.builder()
                .id(l.getId())
                .farmerId(l.getFarmer().getId())
                .farmerName(l.getFarmer().getName())
                .warehouseName(l.getWarehouseName())
                .location(l.getLocation())
                .capacityTonnes(l.getCapacityTonnes())
                .licenseNumber(l.getLicenseNumber())
                .documentUrl(l.getDocumentUrl())
                .status(l.getStatus().name())
                .remarks(l.getRemarks())
                .appliedAt(l.getAppliedAt())
                .reviewedAt(l.getReviewedAt())
                .expiryDate(l.getExpiryDate())
                .reviewedByName(l.getReviewedBy() != null ? l.getReviewedBy().getName() : null)
                .build();
    }
}
