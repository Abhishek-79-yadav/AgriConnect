package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findAllByOrderByNameAsc();
    List<Department> findByActiveTrueOrderByNameAsc();
}
