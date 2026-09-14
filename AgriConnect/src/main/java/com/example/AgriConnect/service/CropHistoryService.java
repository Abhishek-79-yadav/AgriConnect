package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.CropHistoryRequest;
import com.example.AgriConnect.dto.response.CropHistoryResponse;
import com.example.AgriConnect.entity.CropHistory;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.CropHistoryRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CropHistoryService {

    private final CropHistoryRepository cropHistoryRepository;
    private final UserRepository userRepository;

    // =========================
    // ADD A DAILY / SEASONAL RECORD
    // =========================
    public CropHistoryResponse addRecord(CropHistoryRequest request, String email) {

        User farmer = getUser(email);

        CropHistory record = CropHistory.builder()
                .farmer(farmer)
                .cropName(request.getCropName())
                .yield(request.getYield())
                .season(request.getSeason())
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .sellingPricePerUnit(request.getSellingPricePerUnit())
                .costPricePerUnit(request.getCostPricePerUnit())
                .quantity(request.getQuantity())
                .fertilizerUsed(request.getFertilizerUsed())
                .fertilizerQuantityKg(request.getFertilizerQuantityKg())
                .pesticideUsed(request.getPesticideUsed())
                .pesticideQuantityL(request.getPesticideQuantityL())
                .build();

        return mapToResponse(cropHistoryRepository.save(record));
    }

    // =========================
    // MY RECORDS (LOGGED-IN FARMER)
    // =========================
    public List<CropHistoryResponse> getMyRecords(String email) {
        User farmer = getUser(email);

        return cropHistoryRepository.findByFarmerId(farmer.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================
    // DELETE A RECORD (OWNER ONLY)
    // =========================
    public void deleteRecord(Long id, String email) {
        User farmer = getUser(email);

        CropHistory record = cropHistoryRepository.findById(id)
                .orElseThrow(() -> new ApiException("Record not found"));

        if (!record.getFarmer().getId().equals(farmer.getId())) {
            throw new ApiException("You can only delete your own records");
        }

        cropHistoryRepository.deleteById(id);
    }

    // =========================
    // HELPERS
    // =========================
    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));
    }

    private CropHistoryResponse mapToResponse(CropHistory record) {
        double profit = (record.getSellingPricePerUnit() - record.getCostPricePerUnit()) * record.getQuantity();

        return CropHistoryResponse.builder()
                .id(record.getId())
                .cropName(record.getCropName())
                .yield(record.getYield())
                .season(record.getSeason())
                .date(record.getDate())
                .sellingPricePerUnit(record.getSellingPricePerUnit())
                .costPricePerUnit(record.getCostPricePerUnit())
                .quantity(record.getQuantity())
                .fertilizerUsed(record.getFertilizerUsed())
                .fertilizerQuantityKg(record.getFertilizerQuantityKg())
                .pesticideUsed(record.getPesticideUsed())
                .pesticideQuantityL(record.getPesticideQuantityL())
                .profit(profit)
                .build();
    }
}
