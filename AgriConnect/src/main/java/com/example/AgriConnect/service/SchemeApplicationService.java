package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.SchemeApplicationRequest;
import com.example.AgriConnect.dto.response.SchemeApplicationResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.GovernmentSchemeRepository;
import com.example.AgriConnect.repository.SchemeApplicationRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

// Applications move through two independent checks before a final
// decision: documentVerified (has the government reviewer actually looked
// at the paperwork) and status (the decision itself). A reviewer can mark
// documents verified without yet approving, but can't approve without
// having verified them first — that ordering is the whole point of
// having "document verification" as its own step in the checklist rather
// than folding it into approve/reject.
@Service
@RequiredArgsConstructor
public class SchemeApplicationService {

    private final SchemeApplicationRepository applicationRepository;
    private final GovernmentSchemeRepository schemeRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    @Transactional
    public SchemeApplicationResponse apply(String email, SchemeApplicationRequest request) {

        User applicant = getUser(email);

        GovernmentScheme scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        if (!scheme.isActive()) {
            throw new ApiException("This scheme is no longer accepting applications");
        }

        SchemeApplication application = SchemeApplication.builder()
                .scheme(scheme)
                .applicant(applicant)
                .documentUrl(request.getDocumentUrl())
                .status(SchemeApplicationStatus.SUBMITTED)
                .build();

        return mapToResponse(applicationRepository.save(application));
    }

    public List<SchemeApplicationResponse> getMine(String email) {
        User applicant = getUser(email);
        return applicationRepository.findByApplicant_IdOrderByAppliedAtDesc(applicant.getId())
                .stream().map(this::mapToResponse).toList();
    }

    // Government — every application across every scheme.
    public List<SchemeApplicationResponse> getAll() {
        return applicationRepository.findAllByOrderByAppliedAtDesc()
                .stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public SchemeApplicationResponse verifyDocuments(Long id, String reviewerEmail, boolean verified, String remarks) {

        User reviewer = getUser(reviewerEmail);
        SchemeApplication application = getApplication(id);

        application.setDocumentVerified(verified);
        application.setVerificationRemarks(remarks);
        if (application.getStatus() == SchemeApplicationStatus.SUBMITTED) {
            application.setStatus(SchemeApplicationStatus.UNDER_REVIEW);
        }
        application.setReviewedBy(reviewer);
        application.setReviewedAt(LocalDateTime.now());

        SchemeApplication saved = applicationRepository.save(application);
        auditService.log("Marked documents " + (verified ? "verified" : "unverified")
                + " for scheme application #" + saved.getId());

        return mapToResponse(saved);
    }

    @Transactional
    public SchemeApplicationResponse decide(Long id, String reviewerEmail, String statusValue, String remarks) {

        User reviewer = getUser(reviewerEmail);
        SchemeApplication application = getApplication(id);

        SchemeApplicationStatus newStatus;
        try {
            newStatus = SchemeApplicationStatus.valueOf(statusValue.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid application status: " + statusValue);
        }

        if (newStatus != SchemeApplicationStatus.APPROVED && newStatus != SchemeApplicationStatus.REJECTED) {
            throw new ApiException("Decision must be APPROVED or REJECTED");
        }

        if (newStatus == SchemeApplicationStatus.APPROVED && !application.isDocumentVerified()) {
            throw new ApiException("Verify the applicant's documents before approving");
        }

        application.setStatus(newStatus);
        application.setDecisionRemarks(remarks);
        application.setReviewedBy(reviewer);
        application.setReviewedAt(LocalDateTime.now());

        SchemeApplication saved = applicationRepository.save(application);

        notificationService.createNotification(saved.getApplicant(),
                "Your application for \"" + saved.getScheme().getTitle() + "\" was " + newStatus.name().toLowerCase() + ".");
        auditService.log("Scheme application #" + saved.getId() + " " + newStatus.name().toLowerCase());

        return mapToResponse(saved);
    }

    private SchemeApplication getApplication(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private SchemeApplicationResponse mapToResponse(SchemeApplication a) {
        return SchemeApplicationResponse.builder()
                .id(a.getId())
                .schemeId(a.getScheme().getId())
                .schemeTitle(a.getScheme().getTitle())
                .applicantId(a.getApplicant().getId())
                .applicantName(a.getApplicant().getName())
                .documentUrl(a.getDocumentUrl())
                .status(a.getStatus().name())
                .documentVerified(a.isDocumentVerified())
                .verificationRemarks(a.getVerificationRemarks())
                .decisionRemarks(a.getDecisionRemarks())
                .appliedAt(a.getAppliedAt())
                .reviewedAt(a.getReviewedAt())
                .reviewedByName(a.getReviewedBy() != null ? a.getReviewedBy().getName() : null)
                .build();
    }
}
