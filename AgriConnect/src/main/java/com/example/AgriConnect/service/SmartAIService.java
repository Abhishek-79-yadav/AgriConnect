package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.CropSuggestionResponse;
import com.example.AgriConnect.entity.CropHistory;
import com.example.AgriConnect.entity.FarmerProfile;
import com.example.AgriConnect.repository.CropHistoryRepository;
import com.example.AgriConnect.repository.FarmerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SmartAIService {

    private final FarmerProfileRepository profileRepo;
    private final CropHistoryRepository historyRepo;
    private final CropScoringEngine engine;

    public CropSuggestionResponse recommend(Long farmerId, double temp, int humidity) {

        FarmerProfile profile = profileRepo.findByFarmerId(farmerId).orElse(null);
        String soil = profile != null && profile.getSoilType() != null
                ? profile.getSoilType().trim().toLowerCase()
                : "";

        List<CropHistory> history = historyRepo.findByFarmerId(farmerId);

        // Past profit per crop, so a crop that's actually made this farmer
        // money before gets a nudge over one that merely fits the weather.
        Map<String, Double> profitByCrop = history.stream()
                .collect(Collectors.groupingBy(
                        h -> h.getCropName().trim().toLowerCase(),
                        Collectors.summingDouble(h -> (h.getSellingPricePerUnit() - h.getCostPricePerUnit()) * h.getQuantity())
                ));

        List<CropSuggestionResponse.RankedCrop> ranked = engine.rank(temp, humidity, soil, profitByCrop);
        CropSuggestionResponse.RankedCrop top = ranked.get(0);

        return CropSuggestionResponse.builder()
                .recommendedCrop(top.getCrop())
                .reason(top.getReason())
                .confidence(top.getScore())
                .alternatives(ranked.stream().skip(1).limit(3).toList())
                .build();
    }
}
