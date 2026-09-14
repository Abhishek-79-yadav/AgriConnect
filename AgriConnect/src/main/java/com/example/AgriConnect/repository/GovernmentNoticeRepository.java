package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.GovernmentNotice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GovernmentNoticeRepository extends JpaRepository<GovernmentNotice, Long> {
    List<GovernmentNotice> findAllByOrderByCreatedAtDesc();
    List<GovernmentNotice> findByActiveTrueOrderByCreatedAtDesc();
}
