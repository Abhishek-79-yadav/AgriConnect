package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.CropSuggestionResponse;
import org.springframework.stereotype.Component;

import java.util.*;

// Shared scoring logic used by both the profile-based recommendation
// (SmartAIService, which also factors in a farmer's own crop-history
// profit) and the plain conditions-based one (CropRecommendationService).
// Centralizing this means both features give consistent, comparable
// suggestions instead of two different hardcoded rule sets.
@Component
public class CropScoringEngine {

    public record CropProfile(String name, double minTemp, double maxTemp,
                               int minHumidity, int maxHumidity, Set<String> soils) {}

    public final List<CropProfile> CATALOG = List.of(
            new CropProfile("Rice", 20, 37, 60, 100, Set.of("clay", "loamy")),
            new CropProfile("Wheat", 10, 25, 30, 60, Set.of("loamy", "clay")),
            new CropProfile("Maize", 18, 32, 40, 75, Set.of("loamy", "sandy", "black")),
            new CropProfile("Millet", 25, 42, 20, 50, Set.of("sandy", "loamy")),
            new CropProfile("Soybean", 20, 30, 45, 75, Set.of("loamy", "black")),
            new CropProfile("Cotton", 21, 37, 40, 65, Set.of("black", "loamy")),
            new CropProfile("Sugarcane", 21, 38, 60, 100, Set.of("loamy", "clay")),
            new CropProfile("Groundnut", 20, 32, 30, 60, Set.of("sandy", "loamy"))
    );

    public List<CropSuggestionResponse.RankedCrop> rank(
            double temp, int humidity, String soil, Map<String, Double> profitByCrop) {

        return CATALOG.stream()
                .map(c -> score(c, temp, humidity, soil == null ? "" : soil.toLowerCase(), profitByCrop))
                .sorted(Comparator.comparingInt(CropSuggestionResponse.RankedCrop::getScore).reversed())
                .toList();
    }

    private CropSuggestionResponse.RankedCrop score(
            CropProfile c, double temp, int humidity, String soil, Map<String, Double> profitByCrop) {

        int score = 0;
        List<String> reasons = new ArrayList<>();

        if (temp >= c.minTemp() && temp <= c.maxTemp()) {
            score += 40;
            reasons.add("temperature is in range");
        } else {
            double distance = Math.min(Math.abs(temp - c.minTemp()), Math.abs(temp - c.maxTemp()));
            score += Math.max(0, 40 - (int) (distance * 4));
        }

        if (humidity >= c.minHumidity() && humidity <= c.maxHumidity()) {
            score += 30;
            reasons.add("humidity suits it");
        } else {
            int distance = Math.min(Math.abs(humidity - c.minHumidity()), Math.abs(humidity - c.maxHumidity()));
            score += Math.max(0, 30 - distance);
        }

        if (!soil.isBlank() && c.soils().stream().anyMatch(soil::contains)) {
            score += 20;
            reasons.add("matches your " + soil + " soil");
        }

        if (profitByCrop != null) {
            Double pastProfit = profitByCrop.get(c.name().toLowerCase());
            if (pastProfit != null && pastProfit > 0) {
                score += 10;
                reasons.add("profitable for you before (₹" + Math.round(pastProfit) + ")");
            }
        }

        score = Math.min(100, Math.max(0, score));

        String reason = reasons.isEmpty()
                ? "closest overall match to current conditions"
                : String.join(", ", reasons);

        return CropSuggestionResponse.RankedCrop.builder()
                .crop(c.name())
                .score(score)
                .reason(capitalize(reason))
                .build();
    }

    private String capitalize(String s) {
        return s.isEmpty() ? s : Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}
