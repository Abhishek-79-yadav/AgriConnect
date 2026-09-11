package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByUserIdOrderByEndDateDesc(Long userId);

    Optional<Subscription> findFirstByUserIdAndActiveTrueAndEndDateGreaterThanEqualOrderByEndDateDesc(
            Long userId, LocalDate today);
}
