package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Campaign;
import com.example.AgriConnect.entity.CampaignStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {

    List<Campaign> findAllByOrderByCreatedAtDesc();

    // Publicly visible campaigns: explicitly ACTIVE (or SCHEDULED, since
    // effective status is date-derived) and within their date window, for
    // a role that is either ALL or matches the caller.
    @Query("SELECT c FROM Campaign c WHERE c.status IN (com.example.AgriConnect.entity.CampaignStatus.ACTIVE, " +
            "com.example.AgriConnect.entity.CampaignStatus.SCHEDULED) " +
            "AND c.startDate <= :now AND c.endDate >= :now " +
            "AND (c.targetRole = com.example.AgriConnect.entity.CampaignTargetRole.ALL OR c.targetRole = :role) " +
            "ORDER BY c.startDate DESC")
    List<Campaign> findLiveForRole(@Param("now") LocalDateTime now,
                                    @Param("role") com.example.AgriConnect.entity.CampaignTargetRole role);

    // Campaigns whose window has passed but are still marked ACTIVE/SCHEDULED —
    // swept periodically so status stays accurate without a live query join.
    List<Campaign> findByStatusInAndEndDateBefore(List<CampaignStatus> statuses, LocalDateTime cutoff);

    // Atomic increments — a read-then-write here would have the exact same
    // lost-update race under concurrent traffic that RateLimiterService had
    // before it was fixed to use Redis INCR. A homepage banner can easily
    // get simultaneous impression pings from multiple visitors at once.
    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Campaign c SET c.impressions = c.impressions + 1 WHERE c.id = :id")
    void incrementImpressions(@Param("id") Long id);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Campaign c SET c.clicks = c.clicks + 1 WHERE c.id = :id")
    void incrementClicks(@Param("id") Long id);
}
