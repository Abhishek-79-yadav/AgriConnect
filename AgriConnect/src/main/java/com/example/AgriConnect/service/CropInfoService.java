package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.CropInfoResponse;
import com.example.AgriConnect.entity.CropInfo;
import com.example.AgriConnect.repository.CropInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CropInfoService {

    private final CropInfoRepository cropInfoRepository;

    public List<CropInfoResponse> getByCropId(Long cropId) {
        return cropInfoRepository.findByCropId(cropId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CropInfo addInfo(CropInfo info) {
        return cropInfoRepository.save(info);
    }

    public void deleteInfo(Long id) {
        cropInfoRepository.deleteById(id);
    }
    private CropInfoResponse mapToResponse(CropInfo info) {
        return CropInfoResponse.builder()
                .id(info.getId())
                .title(info.getTitle())
                .description(info.getDescription())
                .build();
    }
}