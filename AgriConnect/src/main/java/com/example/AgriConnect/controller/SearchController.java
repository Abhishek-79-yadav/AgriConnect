package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.ProductResponse;
import com.example.AgriConnect.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/name")
    public List<ProductResponse> searchByName(
            @RequestParam String keyword) {

        return searchService.searchByName(keyword);
    }

    @GetMapping("/category")
    public List<ProductResponse> searchByCategory(
            @RequestParam String category) {

        return searchService.searchByCategory(category);
    }

    @GetMapping("/city")
    public List<ProductResponse> searchByCity(
            @RequestParam String city) {

        return searchService.searchByCity(city);
    }

    @GetMapping("/state")
    public List<ProductResponse> searchByState(
            @RequestParam String state) {

        return searchService.searchByState(state);
    }

    @GetMapping("/price")
    public List<ProductResponse> searchByPrice(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {

        return searchService.searchByPrice(min, max);
    }
}