package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.CampaignRequest;
import com.example.AgriConnect.dto.response.CampaignResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.CampaignRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

// Campaign.status is the admin's intent (DRAFT/ACTIVE/PAUSED/ENDED); what
// actually gets shown publicly also depends on whether "now" falls inside
// [startDate, endDate]. effectiveStatus() reconciles the two into a single
// display status rather than requiring a background job to keep the
// stored column in sync with the clock.
@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;

    @Transactional
    public CampaignResponse create(String email, CampaignRequest request) {

        User admin = getUser(email);
        validateDates(request);

        Campaign campaign = Campaign.builder()
                .name(request.getName())
                .description(request.getDescription())
                .type(parseType(request.getType()))
                .status(CampaignStatus.DRAFT)
                .bannerImageUrl(request.getBannerImageUrl())
                .linkUrl(request.getLinkUrl())
                .couponCode(request.getCouponCode())
                .targetRole(parseTargetRole(request.getTargetRole()))
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .createdBy(admin)
                .build();

        return mapToResponse(campaignRepository.save(campaign));
    }

    @Transactional
    public CampaignResponse update(Long id, CampaignRequest request) {

        Campaign campaign = getCampaign(id);
        validateDates(request);

        campaign.setName(request.getName());
        campaign.setDescription(request.getDescription());
        campaign.setType(parseType(request.getType()));
        campaign.setBannerImageUrl(request.getBannerImageUrl());
        campaign.setLinkUrl(request.getLinkUrl());
        campaign.setCouponCode(request.getCouponCode());
        campaign.setTargetRole(parseTargetRole(request.getTargetRole()));
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());

        return mapToResponse(campaignRepository.save(campaign));
    }

    // DRAFT -> ACTIVE (publish), ACTIVE/PAUSED -> ACTIVE (resume), etc.
    // Any state can move to PAUSED or ENDED — those are always safe/final-ish.
    @Transactional
    public CampaignResponse setStatus(Long id, String statusValue) {

        Campaign campaign = getCampaign(id);
        CampaignStatus newStatus;
        try {
            newStatus = CampaignStatus.valueOf(statusValue.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid campaign status: " + statusValue);
        }

        if (newStatus == CampaignStatus.ACTIVE && campaign.getEndDate().isBefore(LocalDateTime.now())) {
            throw new ApiException("This campaign's end date has already passed — update the dates before activating it");
        }

        campaign.setStatus(newStatus);
        return mapToResponse(campaignRepository.save(campaign));
    }

    @Transactional
    public void delete(Long id) {
        Campaign campaign = getCampaign(id);
        campaignRepository.delete(campaign);
    }

    public List<CampaignResponse> getAll() {
        return campaignRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).toList();
    }

    // Public — used by the homepage/banner carousel and similar surfaces.
    public List<CampaignResponse> getLive(String roleValue) {
        CampaignTargetRole role = parseTargetRole(roleValue);
        return campaignRepository.findLiveForRole(LocalDateTime.now(), role)
                .stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public void recordImpression(Long id) {
        if (!campaignRepository.existsById(id)) {
            throw new ResourceNotFoundException("Campaign not found");
        }
        campaignRepository.incrementImpressions(id);
    }

    @Transactional
    public void recordClick(Long id) {
        if (!campaignRepository.existsById(id)) {
            throw new ResourceNotFoundException("Campaign not found");
        }
        campaignRepository.incrementClicks(id);
    }

    private void validateDates(CampaignRequest request) {
        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw new ApiException("End date must be after the start date");
        }
    }

    private CampaignType parseType(String value) {
        try {
            return CampaignType.valueOf(value.toUpperCase());
        } catch (Exception e) {
            throw new ApiException("Invalid campaign type: " + value);
        }
    }

    private CampaignTargetRole parseTargetRole(String value) {
        if (value == null || value.isBlank()) return CampaignTargetRole.ALL;
        try {
            return CampaignTargetRole.valueOf(value.toUpperCase());
        } catch (Exception e) {
            throw new ApiException("Invalid target role: " + value);
        }
    }

    private Campaign getCampaign(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // Reconciles the admin's stored intent with the clock: a SCHEDULED or
    // ACTIVE campaign whose window has actually passed displays as ENDED
    // without needing a background sweep to have run yet.
    private String effectiveStatus(Campaign c) {
        LocalDateTime now = LocalDateTime.now();

        if (c.getStatus() == CampaignStatus.DRAFT || c.getStatus() == CampaignStatus.PAUSED) {
            return c.getStatus().name();
        }
        if (c.getEndDate().isBefore(now)) {
            return CampaignStatus.ENDED.name();
        }
        if (c.getStartDate().isAfter(now)) {
            return CampaignStatus.SCHEDULED.name();
        }
        return CampaignStatus.ACTIVE.name();
    }

    private CampaignResponse mapToResponse(Campaign c) {
        return CampaignResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .description(c.getDescription())
                .type(c.getType().name())
                .status(effectiveStatus(c))
                .bannerImageUrl(c.getBannerImageUrl())
                .linkUrl(c.getLinkUrl())
                .couponCode(c.getCouponCode())
                .targetRole(c.getTargetRole().name())
                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .impressions(c.getImpressions())
                .clicks(c.getClicks())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
