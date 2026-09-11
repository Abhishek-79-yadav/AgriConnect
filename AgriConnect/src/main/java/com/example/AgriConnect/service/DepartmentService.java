package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.DepartmentRequest;
import com.example.AgriConnect.dto.response.DepartmentResponse;
import com.example.AgriConnect.entity.Department;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentResponse create(DepartmentRequest request) {
        Department dept = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();
        return mapToResponse(departmentRepository.save(dept));
    }

    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department dept = getDept(id);
        dept.setName(request.getName());
        dept.setDescription(request.getDescription());
        return mapToResponse(departmentRepository.save(dept));
    }

    public void setActive(Long id, boolean active) {
        Department dept = getDept(id);
        dept.setActive(active);
        departmentRepository.save(dept);
    }

    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAllByOrderByNameAsc()
                .stream().map(this::mapToResponse).toList();
    }

    public List<DepartmentResponse> getActive() {
        return departmentRepository.findByActiveTrueOrderByNameAsc()
                .stream().map(this::mapToResponse).toList();
    }

    private Department getDept(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    private DepartmentResponse mapToResponse(Department d) {
        return DepartmentResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .description(d.getDescription())
                .active(d.isActive())
                .build();
    }
}
