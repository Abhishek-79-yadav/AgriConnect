package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.AgriInput;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgriInputRepository extends JpaRepository<AgriInput, Long> {
    List<AgriInput> findByCompanyId(Long companyId);
}
