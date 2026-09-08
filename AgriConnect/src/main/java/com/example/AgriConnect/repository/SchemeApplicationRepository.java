package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.SchemeApplication;
import com.example.AgriConnect.entity.SchemeApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SchemeApplicationRepository extends JpaRepository<SchemeApplication, Long> {
    List<SchemeApplication> findByApplicant_IdOrderByAppliedAtDesc(Long applicantId);
    List<SchemeApplication> findAllByOrderByAppliedAtDesc();
    List<SchemeApplication> findByScheme_IdOrderByAppliedAtDesc(Long schemeId);
    long countByStatus(SchemeApplicationStatus status);
}
