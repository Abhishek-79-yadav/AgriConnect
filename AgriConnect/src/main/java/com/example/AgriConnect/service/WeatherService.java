package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.WeatherResponse;
import com.example.AgriConnect.exception.ApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public WeatherResponse getWeather(String city) {

        try {
            String url = apiUrl + "?q=" + city + "&appid=" + apiKey + "&units=metric";

            ResponseEntity<String> response =
                    restTemplate.getForEntity(url, String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new ApiException("Weather API failed");
            }

            JsonNode root = mapper.readTree(response.getBody());

            return WeatherResponse.builder()
                    .city(city)
                    .temperature(root.path("main").path("temp").asDouble())
                    .humidity(root.path("main").path("humidity").asInt())
                    .description(root.path("weather").get(0).path("description").asText())
                    .build();

        } catch (Exception e) {
            throw new ApiException("Weather fetch failed: " + e.getMessage());
        }
    }
}