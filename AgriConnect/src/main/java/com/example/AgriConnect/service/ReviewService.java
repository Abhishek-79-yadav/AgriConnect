package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.CreateReviewRequest;
import com.example.AgriConnect.dto.request.UpdateReviewRequest;
import com.example.AgriConnect.dto.response.ReviewResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Reviews are always tied to a specific OrderItem — "verified purchase"
// only, no reviewing a product you never bought. Product.rating /
// totalRatings are recomputed on every create/update/delete rather than
// stored as a running average, since the review volume this platform
// deals with makes a full recompute cheap and immune to drift.
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public ReviewResponse create(String email, CreateReviewRequest request) {

        User buyer = getUser(email);

        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));

        if (!orderItem.getOrder().getBuyer().getId().equals(buyer.getId())) {
            throw new ApiException("You can only review your own purchases");
        }

        if (orderItem.getOrder().getStatus() != OrderStatus.DELIVERED) {
            throw new ApiException("You can only review a product after it's been delivered");
        }

        if (reviewRepository.existsByBuyer_IdAndOrderItem_Id(buyer.getId(), orderItem.getId())) {
            throw new ApiException("You've already reviewed this purchase");
        }

        Review review = Review.builder()
                .product(orderItem.getProduct())
                .buyer(buyer)
                .orderItem(orderItem)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);

        recalculateRating(orderItem.getProduct());

        notificationService.createNotification(
                orderItem.getProduct().getFarmer(),
                buyer.getName() + " left a " + request.getRating() + "★ review on " + orderItem.getProduct().getProductName()
        );

        return mapToResponse(saved);
    }

    @Transactional
    public ReviewResponse update(Long reviewId, String email, UpdateReviewRequest request) {

        User buyer = getUser(email);
        Review review = getOwnedReview(reviewId, buyer);

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);
        recalculateRating(saved.getProduct());

        return mapToResponse(saved);
    }

    @Transactional
    public void delete(Long reviewId, String email) {

        User buyer = getUser(email);
        Review review = getOwnedReview(reviewId, buyer);
        Product product = review.getProduct();

        reviewRepository.delete(review);
        recalculateRating(product);
    }

    // Farmer (product owner) replies to a review on their own product.
    @Transactional
    public ReviewResponse reply(Long reviewId, String email, String reply) {

        User farmer = getUser(email);

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getProduct().getFarmer().getId().equals(farmer.getId())) {
            throw new ApiException("You can only reply to reviews on your own products");
        }

        review.setFarmerReply(reply);
        Review saved = reviewRepository.save(review);

        notificationService.createNotification(saved.getBuyer(),
                farmer.getName() + " replied to your review on " + saved.getProduct().getProductName());

        return mapToResponse(saved);
    }

    public List<ReviewResponse> getForProduct(Long productId) {
        return reviewRepository.findByProduct_IdOrderByCreatedAtDesc(productId)
                .stream().map(this::mapToResponse).toList();
    }

    public List<ReviewResponse> getMine(String email) {
        User buyer = getUser(email);
        return reviewRepository.findByBuyer_IdOrderByCreatedAtDesc(buyer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    public List<ReviewResponse> getForFarmer(String email) {
        User farmer = getUser(email);
        return reviewRepository.findByProduct_Farmer_IdOrderByCreatedAtDesc(farmer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    // A buyer can only review a purchase once they've received it —
    // surfaced separately so the frontend can show "write a review" only
    // where it'd actually be accepted, without silently failing at submit time.
    public List<Long> getReviewableOrderItemIds(String email) {
        User buyer = getUser(email);
        return orderItemRepository.findAll().stream()
                .filter(i -> i.getOrder().getBuyer().getId().equals(buyer.getId()))
                .filter(i -> i.getOrder().getStatus() == OrderStatus.DELIVERED)
                .filter(i -> !reviewRepository.existsByBuyer_IdAndOrderItem_Id(buyer.getId(), i.getId()))
                .map(OrderItem::getId)
                .toList();
    }

    private Review getOwnedReview(Long reviewId, User buyer) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getBuyer().getId().equals(buyer.getId())) {
            throw new ApiException("You can only manage your own reviews");
        }
        return review;
    }

    private void recalculateRating(Product product) {
        List<Review> reviews = reviewRepository.findByProduct_IdOrderByCreatedAtDesc(product.getId());

        if (reviews.isEmpty()) {
            product.setRating(0.0);
            product.setTotalRatings(0);
        } else {
            double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            product.setRating(Math.round(avg * 10) / 10.0);
            product.setTotalRatings(reviews.size());
        }
        productRepository.save(product);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ReviewResponse mapToResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .productId(r.getProduct().getId())
                .productName(r.getProduct().getProductName())
                .orderItemId(r.getOrderItem() != null ? r.getOrderItem().getId() : null)
                .buyerId(r.getBuyer().getId())
                .buyerName(r.getBuyer().getName())
                .rating(r.getRating())
                .comment(r.getComment())
                .farmerReply(r.getFarmerReply())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}
