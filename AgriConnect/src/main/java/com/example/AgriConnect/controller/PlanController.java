package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.PlanResponse;
import com.example.AgriConnect.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PlanController {

    private final PlanRepository planRepo;

    @GetMapping
    public List<PlanResponse> getPlans() {
        return planRepo.findAll().stream()
                .map(p -> PlanResponse.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .tier(p.getTier().name())
                        .price(p.getPrice())
                        .durationDays(p.getDurationDays())
                        .description(p.getDescription())
                        .build())
                .toList();
    }
}
