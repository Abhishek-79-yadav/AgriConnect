package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.ContractDeliveryRequest;
import com.example.AgriConnect.dto.request.CreateContractRequest;
import com.example.AgriConnect.dto.response.ContractResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// Contract farming — a forward agreement for produce that doesn't exist
// as a listing yet, unlike Order (immediate, from stock) or Offer (spot
// negotiation on an existing listing). A BUYER/BRAND proposes terms to a
// FARMER; once accepted it's ACTIVE and the farmer delivers against it —
// possibly in batches — until FULFILLED.
@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final ContractDeliveryRepository deliveryRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // BUYER/BRAND PROPOSES A CONTRACT TO A FARMER
    @Transactional
    public ContractResponse createContract(CreateContractRequest request, String email) {

        User buyer = getUser(email);

        if (buyer.getRole() != Role.BUYER && buyer.getRole() != Role.BRAND) {
            throw new ApiException("Only a buyer or brand account can propose a contract");
        }

        User farmer = userRepository.findById(request.getFarmerId())
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));

        if (farmer.getRole() != Role.FARMER) {
            throw new ApiException("Contracts can only be proposed to a farmer account");
        }

        Crop crop = cropRepository.findById(request.getCropId())
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found"));

        Unit unit;
        try {
            unit = Unit.valueOf(request.getUnit().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid unit: " + request.getUnit());
        }

        if (!request.getDeliveryDate().isAfter(LocalDate.now())) {
            throw new ApiException("Delivery date must be in the future");
        }

        Contract contract = Contract.builder()
                .buyer(buyer)
                .farmer(farmer)
                .crop(crop)
                .quantity(request.getQuantity())
                .unit(unit)
                .agreedPrice(request.getAgreedPrice())
                .advancePayment(request.getAdvancePayment())
                .startDate(LocalDate.now())
                .deliveryDate(request.getDeliveryDate())
                .terms(request.getTerms())
                .status(ContractStatus.PROPOSED)
                .build();

        Contract saved = contractRepository.save(contract);

        notificationService.createNotification(farmer,
                buyer.getName() + " proposed a contract: " + request.getQuantity() + " " + unit
                        + " of " + crop.getName() + " @ ₹" + request.getAgreedPrice()
                        + " by " + request.getDeliveryDate());

        return mapToResponse(saved);
    }

    // FARMER ACCEPTS A PROPOSED CONTRACT — BECOMES BINDING (ACTIVE)
    @Transactional
    public ContractResponse accept(Long contractId, String email) {
        Contract contract = getOwnedByFarmer(contractId, email);

        if (contract.getStatus() != ContractStatus.PROPOSED) {
            throw new ApiException("Only a PROPOSED contract can be accepted (currently " + contract.getStatus() + ")");
        }

        contract.setStatus(ContractStatus.ACTIVE);
        contract.setRespondedAt(LocalDateTime.now());
        Contract saved = contractRepository.save(contract);

        notificationService.createNotification(contract.getBuyer(),
                contract.getFarmer().getName() + " accepted your contract for " + contract.getCrop().getName() + ".");

        return mapToResponse(saved);
    }

    // FARMER REJECTS A PROPOSED CONTRACT
    @Transactional
    public ContractResponse reject(Long contractId, String email) {
        Contract contract = getOwnedByFarmer(contractId, email);

        if (contract.getStatus() != ContractStatus.PROPOSED) {
            throw new ApiException("Only a PROPOSED contract can be rejected (currently " + contract.getStatus() + ")");
        }

        contract.setStatus(ContractStatus.REJECTED);
        contract.setRespondedAt(LocalDateTime.now());
        Contract saved = contractRepository.save(contract);

        notificationService.createNotification(contract.getBuyer(),
                contract.getFarmer().getName() + " declined your contract for " + contract.getCrop().getName() + ".");

        return mapToResponse(saved);
    }

    // EITHER PARTY CANCELS — ONLY BEFORE ANY DELIVERY HAS HAPPENED
    @Transactional
    public ContractResponse cancel(Long contractId, String email) {
        User user = getUser(email);
        Contract contract = getContract(contractId);

        boolean isParty = contract.getBuyer().getId().equals(user.getId())
                || contract.getFarmer().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN || user.getRole() == Role.SUPER_ADMIN;

        if (!isParty && !isAdmin) {
            throw new ApiException("You're not a party to this contract");
        }

        if (contract.getStatus() != ContractStatus.PROPOSED && contract.getStatus() != ContractStatus.ACTIVE) {
            throw new ApiException("This contract is already " + contract.getStatus() + " and can't be cancelled");
        }

        if (contract.getDeliveredQuantity() != null && contract.getDeliveredQuantity() > 0) {
            throw new ApiException("This contract already has deliveries recorded and can't be cancelled outright — contact support");
        }

        contract.setStatus(ContractStatus.CANCELLED);
        Contract saved = contractRepository.save(contract);

        User other = contract.getBuyer().getId().equals(user.getId()) ? contract.getFarmer() : contract.getBuyer();
        notificationService.createNotification(other,
                "The contract for " + contract.getCrop().getName() + " was cancelled.");

        return mapToResponse(saved);
    }

    // FARMER RECORDS A DELIVERY BATCH AGAINST AN ACTIVE CONTRACT
    @Transactional
    public ContractResponse recordDelivery(Long contractId, ContractDeliveryRequest request, String email) {

        Contract contract = getOwnedByFarmer(contractId, email);

        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new ApiException("Only an ACTIVE contract can receive deliveries (currently " + contract.getStatus() + ")");
        }

        double alreadyDelivered = contract.getDeliveredQuantity() != null ? contract.getDeliveredQuantity() : 0.0;
        double newTotal = alreadyDelivered + request.getQuantity();

        if (newTotal > contract.getQuantity()) {
            throw new ApiException("This delivery would exceed the contracted quantity ("
                    + contract.getQuantity() + " " + contract.getUnit() + " agreed, "
                    + alreadyDelivered + " already delivered)");
        }

        deliveryRepository.save(
                ContractDelivery.builder()
                        .contract(contract)
                        .quantity(request.getQuantity())
                        .note(request.getNote())
                        .build()
        );

        contract.setDeliveredQuantity(newTotal);

        if (newTotal >= contract.getQuantity()) {
            contract.setStatus(ContractStatus.FULFILLED);
        }

        Contract saved = contractRepository.save(contract);

        notificationService.createNotification(contract.getBuyer(),
                contract.getFarmer().getName() + " delivered " + request.getQuantity() + " " + contract.getUnit()
                        + " against your contract" + (saved.getStatus() == ContractStatus.FULFILLED
                        ? " — contract now fully delivered." : "."));

        return mapToResponse(saved);
    }

    // BUYER (OR ADMIN) MARKS A CONTRACT AS BREACHED — E.G. DEADLINE PASSED WITHOUT DELIVERY
    @Transactional
    public ContractResponse markBreached(Long contractId, String email) {
        User user = getUser(email);
        Contract contract = getContract(contractId);

        boolean isBuyer = contract.getBuyer().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN || user.getRole() == Role.SUPER_ADMIN;

        if (!isBuyer && !isAdmin) {
            throw new ApiException("Only the contracting buyer or an admin can mark a contract as breached");
        }

        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new ApiException("Only an ACTIVE contract can be marked breached (currently " + contract.getStatus() + ")");
        }

        contract.setStatus(ContractStatus.BREACHED);
        Contract saved = contractRepository.save(contract);

        notificationService.createNotification(contract.getFarmer(),
                "Your contract for " + contract.getCrop().getName() + " was marked as breached.");

        return mapToResponse(saved);
    }

    public List<ContractResponse> getMineAsBuyer(String email) {
        User buyer = getUser(email);
        return contractRepository.findByBuyer_IdOrderByCreatedAtDesc(buyer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    public List<ContractResponse> getMineAsFarmer(String email) {
        User farmer = getUser(email);
        return contractRepository.findByFarmer_IdOrderByCreatedAtDesc(farmer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    public ContractResponse getById(Long contractId, String email) {
        User user = getUser(email);
        Contract contract = getContract(contractId);

        boolean isParty = contract.getBuyer().getId().equals(user.getId())
                || contract.getFarmer().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN || user.getRole() == Role.SUPER_ADMIN;

        if (!isParty && !isAdmin) {
            throw new ApiException("You're not a party to this contract");
        }

        return mapToResponse(contract);
    }

    private Contract getOwnedByFarmer(Long contractId, String email) {
        User farmer = getUser(email);
        Contract contract = getContract(contractId);
        if (!contract.getFarmer().getId().equals(farmer.getId())) {
            throw new ApiException("This isn't your contract");
        }
        return contract;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Contract getContract(Long contractId) {
        return contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));
    }

    private ContractResponse mapToResponse(Contract contract) {

        List<ContractDelivery> deliveries = deliveryRepository
                .findByContract_IdOrderByDeliveredAtAsc(contract.getId());

        double delivered = contract.getDeliveredQuantity() != null ? contract.getDeliveredQuantity() : 0.0;

        return ContractResponse.builder()
                .id(contract.getId())
                .buyerId(contract.getBuyer().getId())
                .buyerName(contract.getBuyer().getName())
                .farmerId(contract.getFarmer().getId())
                .farmerName(contract.getFarmer().getName())
                .cropName(contract.getCrop() != null ? contract.getCrop().getName() : null)
                .quantity(contract.getQuantity())
                .unit(contract.getUnit() != null ? contract.getUnit().name() : null)
                .agreedPrice(contract.getAgreedPrice())
                .advancePayment(contract.getAdvancePayment())
                .startDate(contract.getStartDate())
                .deliveryDate(contract.getDeliveryDate())
                .terms(contract.getTerms())
                .status(contract.getStatus().name())
                .deliveredQuantity(delivered)
                .remainingQuantity(contract.getQuantity() != null ? contract.getQuantity() - delivered : null)
                .respondedAt(contract.getRespondedAt())
                .createdAt(contract.getCreatedAt())
                .updatedAt(contract.getUpdatedAt())
                .deliveries(deliveries.stream().map(d -> ContractResponse.DeliveryResponse.builder()
                                .id(d.getId())
                                .quantity(d.getQuantity())
                                .note(d.getNote())
                                .deliveredAt(d.getDeliveredAt())
                                .build())
                        .toList())
                .build();
    }
}
