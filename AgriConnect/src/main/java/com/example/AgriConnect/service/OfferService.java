package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.CounterOfferRequest;
import com.example.AgriConnect.dto.request.CreateOfferRequest;
import com.example.AgriConnect.dto.request.OfferCheckoutRequest;
import com.example.AgriConnect.dto.response.OfferResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Farmer-buyer price/quantity negotiation, separate from the fixed-price
// cart/checkout flow. A buyer proposes a price on a product; the farmer
// accepts, rejects, or counters; the buyer can then accept/reject the
// counter or withdraw. Once ACCEPTED, the buyer converts the offer into a
// real Order at the agreed price via checkout() below — mirroring
// OrderService.checkout()'s order-creation shape but at the negotiated
// price/quantity instead of the listing price/cart quantity.
@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final NotificationService notificationService;

    // BUYER MAKES AN OFFER ON A PRODUCT
    @Transactional
    public OfferResponse createOffer(CreateOfferRequest request, String email) {

        User buyer = getUser(email);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.isApproved() || !product.isAvailable()) {
            throw new ApiException("This product isn't currently available for offers");
        }

        if (product.getFarmer().getId().equals(buyer.getId())) {
            throw new ApiException("You can't make an offer on your own product");
        }

        if (request.getQuantity() > product.getQuantity()) {
            throw new ApiException("Only " + product.getQuantity() + " " + product.getUnit()
                    + " available — reduce the offer quantity");
        }

        Offer offer = Offer.builder()
                .product(product)
                .buyer(buyer)
                .farmer(product.getFarmer())
                .quantity(request.getQuantity())
                .offeredPrice(request.getOfferedPrice())
                .message(request.getMessage())
                .status(OfferStatus.PENDING)
                .build();

        Offer saved = offerRepository.save(offer);

        notificationService.createNotification(product.getFarmer(),
                "New offer on \"" + product.getProductName() + "\": " + request.getQuantity()
                        + " " + product.getUnit() + " @ ₹" + request.getOfferedPrice());

        return mapToResponse(saved);
    }

    // FARMER ACCEPTS THE BUYER'S ORIGINAL OFFER AS-IS
    @Transactional
    public OfferResponse accept(Long offerId, String email) {
        Offer offer = getOwnedByFarmer(offerId, email);
        requireRespondable(offer);

        offer.setStatus(OfferStatus.ACCEPTED);
        offer.setRespondedAt(LocalDateTime.now());
        Offer saved = offerRepository.save(offer);

        notificationService.createNotification(offer.getBuyer(),
                "Your offer on \"" + offer.getProduct().getProductName() + "\" was accepted — complete checkout to confirm your order.");

        return mapToResponse(saved);
    }

    // FARMER REJECTS THE OFFER (WHETHER STILL PENDING OR THEY JUST DON'T WANT TO COUNTER)
    @Transactional
    public OfferResponse reject(Long offerId, String email) {
        Offer offer = getOwnedByFarmer(offerId, email);
        requireRespondable(offer);

        offer.setStatus(OfferStatus.REJECTED);
        offer.setRespondedAt(LocalDateTime.now());
        Offer saved = offerRepository.save(offer);

        notificationService.createNotification(offer.getBuyer(),
                "Your offer on \"" + offer.getProduct().getProductName() + "\" was declined.");

        return mapToResponse(saved);
    }

    // FARMER COUNTERS WITH A DIFFERENT PRICE
    @Transactional
    public OfferResponse counter(Long offerId, CounterOfferRequest request, String email) {
        Offer offer = getOwnedByFarmer(offerId, email);

        if (offer.getStatus() != OfferStatus.PENDING) {
            throw new ApiException("Only a PENDING offer can be countered (currently " + offer.getStatus() + ")");
        }

        offer.setCounterPrice(request.getCounterPrice());
        offer.setCounterMessage(request.getCounterMessage());
        offer.setStatus(OfferStatus.COUNTERED);
        Offer saved = offerRepository.save(offer);

        notificationService.createNotification(offer.getBuyer(),
                "The farmer countered your offer on \"" + offer.getProduct().getProductName()
                        + "\" at ₹" + request.getCounterPrice());

        return mapToResponse(saved);
    }

    // BUYER ACCEPTS THE FARMER'S COUNTER-OFFER
    @Transactional
    public OfferResponse acceptCounter(Long offerId, String email) {
        User buyer = getUser(email);
        Offer offer = getOffer(offerId);

        if (!offer.getBuyer().getId().equals(buyer.getId())) {
            throw new ApiException("This isn't your offer");
        }
        if (offer.getStatus() != OfferStatus.COUNTERED) {
            throw new ApiException("There's no counter-offer to accept (status: " + offer.getStatus() + ")");
        }

        // The counter price becomes the agreed price from here on.
        offer.setOfferedPrice(offer.getCounterPrice());
        offer.setStatus(OfferStatus.ACCEPTED);
        offer.setRespondedAt(LocalDateTime.now());
        Offer saved = offerRepository.save(offer);

        notificationService.createNotification(offer.getFarmer(),
                "The buyer accepted your counter-offer on \"" + offer.getProduct().getProductName() + "\".");

        return mapToResponse(saved);
    }

    // BUYER WITHDRAWS AN OFFER THAT'S STILL PENDING OR COUNTERED
    @Transactional
    public OfferResponse withdraw(Long offerId, String email) {
        User buyer = getUser(email);
        Offer offer = getOffer(offerId);

        if (!offer.getBuyer().getId().equals(buyer.getId())) {
            throw new ApiException("This isn't your offer");
        }
        requireRespondable(offer);

        offer.setStatus(OfferStatus.WITHDRAWN);
        offer.setRespondedAt(LocalDateTime.now());
        return mapToResponse(offerRepository.save(offer));
    }

    // BUYER CONVERTS AN ACCEPTED OFFER INTO A REAL ORDER AT THE AGREED PRICE
    @Transactional
    public OfferResponse checkout(Long offerId, OfferCheckoutRequest request, String email) {

        User buyer = getUser(email);
        Offer offer = getOffer(offerId);

        if (!offer.getBuyer().getId().equals(buyer.getId())) {
            throw new ApiException("This isn't your offer");
        }
        if (offer.getStatus() != OfferStatus.ACCEPTED) {
            throw new ApiException("Only an ACCEPTED offer can be checked out (currently " + offer.getStatus() + ")");
        }

        Product product = offer.getProduct();

        if (offer.getQuantity() > product.getQuantity()) {
            throw new ApiException("Out of stock: " + product.getProductName()
                    + " — only " + product.getQuantity() + " left");
        }

        boolean isCod = "COD".equalsIgnoreCase(request.getPaymentMethod());

        product.setQuantity(product.getQuantity() - offer.getQuantity());
        productRepository.save(product);

        BigDecimal itemTotal = offer.getOfferedPrice().multiply(BigDecimal.valueOf(offer.getQuantity()));

        Order order = Order.builder()
                .buyer(buyer)
                .status(isCod ? OrderStatus.CONFIRMED : OrderStatus.PENDING)
                .paid(false)
                .paymentMethod(isCod ? "COD" : "ONLINE")
                .deliveryName(request.getDeliveryName())
                .deliveryPhone(request.getDeliveryPhone())
                .deliveryAddressLine(request.getDeliveryAddressLine())
                .deliveryCity(request.getDeliveryCity())
                .deliveryState(request.getDeliveryState())
                .deliveryPincode(request.getDeliveryPincode())
                .totalPrice(itemTotal.doubleValue())
                .items(new ArrayList<>())
                .build();

        OrderItem item = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(offer.getQuantity())
                .price(itemTotal.doubleValue())
                .build();
        order.getItems().add(item);

        Order savedOrder = orderRepository.save(order);

        statusHistoryRepository.save(
                OrderStatusHistory.builder()
                        .order(savedOrder)
                        .status(savedOrder.getStatus())
                        .note("Order created from an accepted offer (negotiated price ₹" + offer.getOfferedPrice() + ")")
                        .build()
        );

        offer.setStatus(OfferStatus.CONVERTED);
        offer.setConvertedOrderId(savedOrder.getId());
        Offer savedOffer = offerRepository.save(offer);

        notificationService.createNotification(offer.getFarmer(),
                "The buyer completed checkout on your accepted offer — order #" + savedOrder.getId() + ".");

        return mapToResponse(savedOffer);
    }

    public List<OfferResponse> getMine(String email) {
        User buyer = getUser(email);
        return offerRepository.findByBuyer_IdOrderByCreatedAtDesc(buyer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    public List<OfferResponse> getForFarmer(String email) {
        User farmer = getUser(email);
        return offerRepository.findByFarmer_IdOrderByCreatedAtDesc(farmer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    private Offer getOwnedByFarmer(Long offerId, String email) {
        User farmer = getUser(email);
        Offer offer = getOffer(offerId);
        if (!offer.getFarmer().getId().equals(farmer.getId())) {
            throw new ApiException("This offer isn't on one of your products");
        }
        return offer;
    }

    private void requireRespondable(Offer offer) {
        if (offer.getStatus() != OfferStatus.PENDING && offer.getStatus() != OfferStatus.COUNTERED) {
            throw new ApiException("This offer is already " + offer.getStatus() + " and can't be changed");
        }
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Offer getOffer(Long offerId) {
        return offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found"));
    }

    private OfferResponse mapToResponse(Offer offer) {
        return OfferResponse.builder()
                .id(offer.getId())
                .productId(offer.getProduct().getId())
                .productName(offer.getProduct().getProductName())
                .listedPrice(offer.getProduct().getPrice())
                .buyerId(offer.getBuyer().getId())
                .buyerName(offer.getBuyer().getName())
                .farmerId(offer.getFarmer().getId())
                .farmerName(offer.getFarmer().getName())
                .quantity(offer.getQuantity())
                .offeredPrice(offer.getOfferedPrice())
                .message(offer.getMessage())
                .status(offer.getStatus().name())
                .counterPrice(offer.getCounterPrice())
                .counterMessage(offer.getCounterMessage())
                .convertedOrderId(offer.getConvertedOrderId())
                .respondedAt(offer.getRespondedAt())
                .createdAt(offer.getCreatedAt())
                .updatedAt(offer.getUpdatedAt())
                .build();
    }
}
