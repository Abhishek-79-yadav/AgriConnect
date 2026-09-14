package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.FarmerProfileRequest;
import com.example.AgriConnect.dto.response.FarmerProfileResponse;
import com.example.AgriConnect.entity.FarmerProfile;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.FarmerProfileRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FarmerProfileService {

    private final FarmerProfileRepository profileRepo;
    private final UserRepository userRepository;

    public FarmerProfileResponse getMyProfile(String email) {
        User farmer = getUser(email);

        FarmerProfile profile = profileRepo.findByFarmerId(farmer.getId())
                .orElse(FarmerProfile.builder().farmer(farmer).build());

        return toResponse(profile);
    }

    // Creates the profile row on first save (SmartAIService reads it via
    // findByFarmerId, which returns empty until this has been called once).
    public FarmerProfileResponse updateMyProfile(FarmerProfileRequest request, String email) {
        User farmer = getUser(email);

        FarmerProfile profile = profileRepo.findByFarmerId(farmer.getId())
                .orElse(FarmerProfile.builder().farmer(farmer).build());

        profile.setSoilType(request.getSoilType());
        profile.setState(request.getState());
        profile.setCity(request.getCity());
        profile.setLandSizeAcres(request.getLandSizeAcres());

        return toResponse(profileRepo.save(profile));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));
    }

    private FarmerProfileResponse toResponse(FarmerProfile profile) {
        return FarmerProfileResponse.builder()
                .soilType(profile.getSoilType())
                .state(profile.getState())
                .city(profile.getCity())
                .landSizeAcres(profile.getLandSizeAcres())
                .build();
    }
}
