package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.TaxConfigRequest;
import com.example.AgriConnect.dto.response.TaxConfigResponse;
import com.example.AgriConnect.entity.TaxConfig;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.TaxConfigRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaxConfigService {

    private final TaxConfigRepository taxConfigRepository;
    private final UserRepository userRepository;

    public TaxConfigResponse create(String email, TaxConfigRequest request) {

        User official = getUser(email);

        TaxConfig config = TaxConfig.builder()
                .taxType(request.getTaxType())
                .category(request.getCategory())
                .ratePercent(request.getRatePercent())
                .description(request.getDescription())
                .effectiveFrom(request.getEffectiveFrom())
                .active(true)
                .createdBy(official)
                .build();

        return mapToResponse(taxConfigRepository.save(config));
    }

    public TaxConfigResponse update(Long id, TaxConfigRequest request) {
        TaxConfig config = getConfig(id);
        config.setTaxType(request.getTaxType());
        config.setCategory(request.getCategory());
        config.setRatePercent(request.getRatePercent());
        config.setDescription(request.getDescription());
        config.setEffectiveFrom(request.getEffectiveFrom());
        return mapToResponse(taxConfigRepository.save(config));
    }

    public void setActive(Long id, boolean active) {
        TaxConfig config = getConfig(id);
        config.setActive(active);
        taxConfigRepository.save(config);
    }

    public List<TaxConfigResponse> getAll() {
        return taxConfigRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).toList();
    }

    // Public — buyers/farmers can look up current applicable rates.
    public List<TaxConfigResponse> getActive() {
        return taxConfigRepository.findByActiveTrueOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).toList();
    }

    private TaxConfig getConfig(Long id) {
        return taxConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tax config not found"));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private TaxConfigResponse mapToResponse(TaxConfig t) {
        return TaxConfigResponse.builder()
                .id(t.getId())
                .taxType(t.getTaxType())
                .category(t.getCategory())
                .ratePercent(t.getRatePercent())
                .description(t.getDescription())
                .active(t.isActive())
                .effectiveFrom(t.getEffectiveFrom())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
