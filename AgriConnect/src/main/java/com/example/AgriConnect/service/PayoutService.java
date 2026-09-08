package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.FarmerPayoutResponse;
import com.example.AgriConnect.entity.OrderItem;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayoutService {

    private final OrderItemRepository orderItemRepository;
    private final WalletService walletService;

    /**
     * Every farmer who has at least one item from a paid order, with how
     * much of that they've been paid out vs still owed. Only items from
     * orders the BUYER has already paid count here — an unpaid order isn't
     * money the platform has to pass on yet.
     */
    public List<FarmerPayoutResponse> getPayoutSummary() {

        List<OrderItem> items = orderItemRepository.findAllFromPaidOrders();

        Map<User, List<OrderItem>> byFarmer = items.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getProduct().getFarmer(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<FarmerPayoutResponse> result = new ArrayList<>();

        for (Map.Entry<User, List<OrderItem>> entry : byFarmer.entrySet()) {
            User farmer = entry.getKey();
            List<OrderItem> farmerItems = entry.getValue();

            double pending = 0;
            double paidOut = 0;
            List<FarmerPayoutResponse.OrderItemLine> pendingLines = new ArrayList<>();

            for (OrderItem item : farmerItems) {
                double lineTotal = item.getPrice() * item.getQuantity();

                if ("PAID".equalsIgnoreCase(item.getPayoutStatus())) {
                    paidOut += lineTotal;
                } else {
                    pending += lineTotal;
                    pendingLines.add(FarmerPayoutResponse.OrderItemLine.builder()
                            .orderItemId(item.getId())
                            .orderId(item.getOrder().getId())
                            .productName(item.getProduct().getProductName())
                            .quantity(item.getQuantity())
                            .price(item.getPrice())
                            .lineTotal(lineTotal)
                            .build());
                }
            }

            result.add(FarmerPayoutResponse.builder()
                    .farmerId(farmer.getId())
                    .farmerName(farmer.getName())
                    .farmerEmail(farmer.getEmail())
                    .pendingAmount(pending)
                    .paidOutAmount(paidOut)
                    .pendingItems(pendingLines)
                    .build());
        }

        // Farmers owed the most money float to the top.
        result.sort((a, b) -> Double.compare(b.getPendingAmount(), a.getPendingAmount()));

        return result;
    }

    /** Marks a single order line as paid out to its farmer, and credits their wallet. */
    @org.springframework.transaction.annotation.Transactional
    public void markPaidOut(Long orderItemId) {
        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new ApiException("Order item not found"));

        if (!item.getOrder().isPaid()) {
            throw new ApiException("Cannot pay out an item whose order hasn't been paid by the buyer yet");
        }

        if ("PAID".equalsIgnoreCase(item.getPayoutStatus())) {
            throw new ApiException("This item has already been paid out");
        }

        item.setPayoutStatus("PAID");
        orderItemRepository.save(item);

        double lineTotal = item.getPrice() * item.getQuantity();
        walletService.credit(
                item.getProduct().getFarmer(),
                lineTotal,
                "Payout for order #" + item.getOrder().getId() + " — " + item.getProduct().getProductName(),
                "PAYOUT",
                item.getId()
        );
    }
}
