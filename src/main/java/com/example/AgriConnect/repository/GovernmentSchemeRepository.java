package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.GovernmentScheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GovernmentSchemeRepository extends JpaRepository<GovernmentScheme, Long> {

    List<GovernmentScheme> findByActiveTrue();

    List<GovernmentScheme> findByStateIgnoreCase(String state);
}