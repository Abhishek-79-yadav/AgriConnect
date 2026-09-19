package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.RatingRequest;
import com.example.AgriConnect.dto.response.RatingResponse;
import com.example.AgriConnect.entity.Rating;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.RatingRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.example.AgriConnect.mapper.RatingMapper.mapToResponse;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;

    // ⭐ RATE FARMER (FIXED METHOD)
    public RatingResponse rateFarmer(RatingRequest request, String buyerEmail) {

        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        User farmer = userRepository.findById(request.getFarmerId())
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));

        if (request.getStars() < 1 || request.getStars() > 5) {
            throw new ResourceNotFoundException("Stars must be between 1 and 5");
        }

        Rating rating = new Rating();
        rating.setBuyer(buyer);
        rating.setFarmer(farmer);
        rating.setStars(request.getStars());
        rating.setComment(request.getComment());

        Rating saved = ratingRepository.save(rating);

        return mapToResponse(saved);
    }

    // ⭐ AVERAGE RATING
    public double getAverageRating(Long farmerId) {
        return ratingRepository.getAverageRating(farmerId);
    }

    // ⭐ ALL RATINGS
    public List<Rating> getFarmerRatings(Long farmerId) {
        return ratingRepository.findByFarmerId(farmerId);
    }
}