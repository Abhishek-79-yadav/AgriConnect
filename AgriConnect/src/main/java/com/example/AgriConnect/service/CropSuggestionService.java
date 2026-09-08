package com.example.AgriConnect.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropSuggestionService {

    public List<String> suggest(String season, String soilType) {

        if (season.equalsIgnoreCase("summer")) {
            return List.of("Cotton", "Maize", "Groundnut");
        }

        if (season.equalsIgnoreCase("winter")) {
            return List.of("Wheat", "Mustard", "Peas");
        }

        if (soilType.equalsIgnoreCase("black")) {
            return List.of("Cotton", "Soybean");
        }

        return List.of("Rice", "Vegetables", "Pulses");
    }
}