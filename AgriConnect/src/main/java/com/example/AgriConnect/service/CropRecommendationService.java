package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.CropSuggestionRequest;
import com.example.AgriConnect.dto.response.CropSuggestionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CropRecommendationService {

    private final CropScoringEngine engine;

    public CropSuggestionResponse suggest(double temp, int humidity, String soil) {

        List<CropSuggestionResponse.RankedCrop> ranked = engine.rank(temp, humidity, soil, null);
        CropSuggestionResponse.RankedCrop top = ranked.get(0);

        return CropSuggestionResponse.builder()
                .recommendedCrop(top.getCrop())
                .reason(top.getReason())
                .confidence(top.getScore())
                .alternatives(ranked.stream().skip(1).limit(3).toList())
                .build();
    }

    public CropSuggestionResponse suggestCrop(CropSuggestionRequest request) {
        return suggest(request.getTemperature(), request.getHumidity(), request.getSoilType());
    }
}
