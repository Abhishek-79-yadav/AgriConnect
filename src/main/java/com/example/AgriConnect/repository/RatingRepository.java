package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByFarmerId(Long farmerId);

    @Query("SELECT COALESCE(AVG(r.stars),0) FROM Rating r WHERE r.farmer.id = :farmerId")
    Double getAverageRating(@Param("farmerId") Long farmerId);
}