package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.CreateWarehouseReceiptRequest;
import com.example.AgriConnect.dto.request.QualityInspectionRequest;
import com.example.AgriConnect.dto.response.WarehouseReceiptResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

// Quality & Warehouse Receipt module — a farmer stores produce at one of
// their APPROVED warehouses (see WarehouseLicense) and requests a
// receipt; a GOVERNMENT/ADMIN inspector then grades it. Independent of
// the marketplace: produce can be stored and certified before the farmer
// decides whether/how to sell it.
@Service
@RequiredArgsConstructor
public class WarehouseReceiptService {

    private final WarehouseReceiptRepository receiptRepository;
    private final QualityInspectionRepository inspectionRepository;
    private final WarehouseLicenseRepository licenseRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // FARMER REQUESTS A RECEIPT FOR PRODUCE STORED AT THEIR OWN WAREHOUSE
    @Transactional
    public WarehouseReceiptResponse createReceipt(CreateWarehouseReceiptRequest request, String email) {

        User farmer = getUser(email);

        WarehouseLicense license = licenseRepository.findById(request.getWarehouseLicenseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse license not found"));

        if (!license.getFarmer().getId().equals(farmer.getId())) {
            throw new ApiException("You can only store produce at your own warehouse");
        }

        if (license.getStatus() != LicenseStatus
                .APPROVED) {
            throw new ApiException("This warehouse license is " + license.getStatus()
                    + " — only an APPROVED license can accept stored produce");
        }

        Crop crop = cropRepository.findById(request.getCropId())
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found"));

        Unit unit;
        try {
            unit = Unit.valueOf(request.getUnit().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid unit: " + request.getUnit());
        }

        WarehouseReceipt receipt = WarehouseReceipt.builder()
                .warehouseLicense(license)
                .farmer(farmer)
                .crop(crop)
                .quantity(request.getQuantity())
                .unit(unit)
                .status(WarehouseReceiptStatus.PENDING_INSPECTION)
                .remarks(request.getRemarks())
                .build();

        WarehouseReceipt saved = receiptRepository.save(receipt);

        return mapToResponse(saved);
    }

    // GOVERNMENT (or ADMIN) INSPECTS A PENDING RECEIPT
    @Transactional
    public WarehouseReceiptResponse inspect(Long receiptId, QualityInspectionRequest request, String email) {

        User inspector = getUser(email);

        if (inspector.getRole() != Role.GOVERNMENT
                && inspector.getRole() != Role.ADMIN
                && inspector.getRole() != Role.SUPER_ADMIN) {
            throw new ApiException("Only a government officer or admin can perform quality inspections");
        }

        WarehouseReceipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse receipt not found"));

        if (receipt.getStatus() != WarehouseReceiptStatus.PENDING_INSPECTION) {
            throw new ApiException("This receipt is already " + receipt.getStatus() + " and can't be re-inspected");
        }

        QualityGrade grade;
        try {
            grade = QualityGrade.valueOf(request.getGrade().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid grade: " + request.getGrade());
        }

        QualityInspection inspection = QualityInspection.builder()
                .warehouseReceipt(receipt)
                .inspector(inspector)
                .grade(grade)
                .moisturePercent(request.getMoisturePercent())
                .foreignMatterPercent(request.getForeignMatterPercent())
                .passed(request.getPassed())
                .remarks(request.getRemarks())
                .build();

        inspectionRepository.save(inspection);

        if (request.getPassed()) {
            receipt.setStatus(WarehouseReceiptStatus.ISSUED);
            receipt.setReceiptNumber("WR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        } else {
            receipt.setStatus(WarehouseReceiptStatus.REJECTED);
        }

        WarehouseReceipt saved = receiptRepository.save(receipt);

        notificationService.createNotification(receipt.getFarmer(),
                request.getPassed()
                        ? "Your warehouse receipt has been issued (grade " + grade + ", #" + saved.getReceiptNumber() + ")."
                        : "Your warehouse receipt request was rejected after inspection."
                                + (request.getRemarks() != null ? " — " + request.getRemarks() : ""));

        return mapToResponse(saved);
    }

    // FARMER WITHDRAWS PRODUCE THAT WAS PREVIOUSLY ISSUED A RECEIPT
    @Transactional
    public WarehouseReceiptResponse withdraw(Long receiptId, String email) {

        User user = getUser(email);
        WarehouseReceipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse receipt not found"));

        boolean isAdmin = user.getRole() == Role.ADMIN || user.getRole() == Role.SUPER_ADMIN;
        if (!isAdmin && !receipt.getFarmer().getId().equals(user.getId())) {
            throw new ApiException("You can only withdraw your own stored produce");
        }

        if (receipt.getStatus() != WarehouseReceiptStatus.ISSUED) {
            throw new ApiException("Only an ISSUED receipt can be withdrawn (currently " + receipt.getStatus() + ")");
        }

        receipt.setStatus(WarehouseReceiptStatus.WITHDRAWN);
        WarehouseReceipt saved = receiptRepository.save(receipt);

        return mapToResponse(saved);
    }

    public List<WarehouseReceiptResponse> getMine(String email) {
        User farmer = getUser(email);
        return receiptRepository.findByFarmer_IdOrderByStoredAtDesc(farmer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    public List<WarehouseReceiptResponse> getPending() {
        return receiptRepository.findByStatusOrderByStoredAtAsc(WarehouseReceiptStatus.PENDING_INSPECTION)
                .stream().map(this::mapToResponse).toList();
    }

    public List<WarehouseReceiptResponse> getAll() {
        return receiptRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    public WarehouseReceiptResponse getById(Long receiptId, String email) {
        User user = getUser(email);
        WarehouseReceipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse receipt not found"));

        boolean isAdmin = user.getRole() == Role.ADMIN || user.getRole() == Role.SUPER_ADMIN
                || user.getRole() == Role.GOVERNMENT;
        if (!isAdmin && !receipt.getFarmer().getId().equals(user.getId())) {
            throw new ApiException("You don't have access to this warehouse receipt");
        }

        return mapToResponse(receipt);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private WarehouseReceiptResponse mapToResponse(WarehouseReceipt receipt) {

        List<QualityInspection> inspections = inspectionRepository
                .findByWarehouseReceipt_IdOrderByInspectedAtDesc(receipt.getId());

        return WarehouseReceiptResponse.builder()
                .id(receipt.getId())
                .warehouseLicenseId(receipt.getWarehouseLicense().getId())
                .warehouseName(receipt.getWarehouseLicense().getWarehouseName())
                .farmerName(receipt.getFarmer().getName())
                .cropName(receipt.getCrop().getName())
                .quantity(receipt.getQuantity())
                .unit(receipt.getUnit() != null ? receipt.getUnit().name() : null)
                .status(receipt.getStatus().name())
                .receiptNumber(receipt.getReceiptNumber())
                .remarks(receipt.getRemarks())
                .storedAt(receipt.getStoredAt())
                .updatedAt(receipt.getUpdatedAt())
                .inspections(inspections.stream().map(i -> WarehouseReceiptResponse.QualityInspectionResponse.builder()
                                .id(i.getId())
                                .inspectorName(i.getInspector() != null ? i.getInspector().getName() : null)
                                .grade(i.getGrade() != null ? i.getGrade().name() : null)
                                .moisturePercent(i.getMoisturePercent())
                                .foreignMatterPercent(i.getForeignMatterPercent())
                                .passed(i.isPassed())
                                .remarks(i.getRemarks())
                                .inspectedAt(i.getInspectedAt())
                                .build())
                        .toList())
                .build();
    }
}
