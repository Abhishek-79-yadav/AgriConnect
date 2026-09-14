package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.CropResponse;
import com.example.AgriConnect.entity.Crop;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.CropRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CropService {

    private final CropRepository cropRepository;

    // GET ALL (DTO)
    public List<CropResponse> getAllCrops() {

        return cropRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // GET BY ID (DTO)
    public CropResponse getCropById(Long id) {

        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found"));

        return mapToResponse(crop);
    }

    // ADD (DTO return better hai)
    public CropResponse addCrop(Crop crop) {

        Crop saved = cropRepository.save(crop);
        return mapToResponse(saved);
    }

    public CropResponse createCrop(CropResponse request) {

        Crop crop = Crop.builder()
                .name(request.getName())
                .season(request.getSeason())
                .description(request.getDescription())
                .build();

        Crop saved = cropRepository.save(crop);

        return CropResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .season(saved.getSeason())
                .description(saved.getDescription())
                .build();
    }

    // DELETE (OK)
    public void deleteCrop(Long id) {
        cropRepository.deleteById(id);
    }

    // MAPPER
    private CropResponse mapToResponse(Crop crop) {
        return CropResponse.builder()
                .id(crop.getId())
                .name(crop.getName())
                .season(crop.getSeason())
                .description(crop.getDescription())
                .build();
    }
}