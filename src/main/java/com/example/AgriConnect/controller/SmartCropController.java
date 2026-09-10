package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.CropSuggestionResponse;
import com.example.AgriConnect.dto.response.WeatherResponse;
import com.example.AgriConnect.service.CropRecommendationService;
import com.example.AgriConnect.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/smart-crop")
@RequiredArgsConstructor
public class SmartCropController {

    private final WeatherService weatherService;
    private final CropRecommendationService cropService;

    @GetMapping("/{city}")
    public ResponseEntity<CropSuggestionResponse> suggest(
            @PathVariable String city) {

        WeatherResponse weather = weatherService.getWeather(city);

        return ResponseEntity.ok(
                cropService.suggest(
                        weather.getTemperature(),
                        weather.getHumidity(),
                        "clay"
                )
        );
    }
}