package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.AgriInputRequest;
import com.example.AgriConnect.dto.response.AgriInputResponse;
import com.example.AgriConnect.entity.AgriInput;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.AgriInputRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgriInputService {

    private final AgriInputRepository agriInputRepo;
    private final UserRepository userRepo;
    private final SubscriptionService subscriptionService;

    public AgriInputResponse create(String companyEmail, AgriInputRequest request) {
        User company = userRepo.findByEmail(companyEmail)
                .orElseThrow(() -> new ApiException("User not found"));

        subscriptionService.requireActiveSubscription(company.getId());

        AgriInput input = AgriInput.builder()
                .company(company)
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .stock(request.getStock())
                .unit(request.getUnit())
                .imageUrl(request.getImageUrl())
                .approved(false)
                .build();

        return toResponse(agriInputRepo.save(input));
    }

    public List<AgriInputResponse> getMine(String companyEmail) {
        User company = userRepo.findByEmail(companyEmail)
                .orElseThrow(() -> new ApiException("User not found"));

        return agriInputRepo.findByCompanyId(company.getId()).stream().map(this::toResponse).toList();
    }

    public void delete(String companyEmail, Long id) {
        User company = userRepo.findByEmail(companyEmail)
                .orElseThrow(() -> new ApiException("User not found"));

        AgriInput input = agriInputRepo.findById(id)
                .orElseThrow(() -> new ApiException("Listing not found"));

        if (!input.getCompany().getId().equals(company.getId())) {
            throw new ApiException("You can only delete your own listings");
        }

        agriInputRepo.delete(input);
    }

    /** Buyer-facing browse — requires an active subscription, approved listings only. */
    public List<AgriInputResponse> browse(String buyerEmail) {
        User buyer = userRepo.findByEmail(buyerEmail)
                .orElseThrow(() -> new ApiException("User not found"));

        subscriptionService.requireActiveSubscription(buyer.getId());

        return agriInputRepo.findAll().stream()
                .filter(AgriInput::isApproved)
                .map(this::toResponse)
                .toList();
    }

    /**
     * Farmer dashboard marketing banner — deliberately NOT subscription
     * gated. Farmers aren't buying agri-inputs through the marketplace
     * (buyers are); this is just promotional display, so it stays open.
     * Capped to a handful so it reads as a banner, not a full catalog.
     */
    public List<AgriInputResponse> getFarmerAds() {
        return agriInputRepo.findAll().stream()
                .filter(AgriInput::isApproved)
                .limit(5)
                .map(this::toResponse)
                .toList();
    }

    private AgriInputResponse toResponse(AgriInput input) {
        return AgriInputResponse.builder()
                .id(input.getId())
                .name(input.getName())
                .description(input.getDescription())
                .category(input.getCategory())
                .price(input.getPrice())
                .stock(input.getStock())
                .unit(input.getUnit())
                .imageUrl(input.getImageUrl())
                .companyName(input.getCompany().getName())
                .companyId(input.getCompany().getId())
                .approved(input.isApproved())
                .build();
    }
}
