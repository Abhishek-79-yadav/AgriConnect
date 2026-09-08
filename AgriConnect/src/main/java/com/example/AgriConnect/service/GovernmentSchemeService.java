package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.SchemeRequest;
import com.example.AgriConnect.dto.response.SchemeResponse;
import com.example.AgriConnect.entity.Department;
import com.example.AgriConnect.entity.GovernmentScheme;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.DepartmentRepository;
import com.example.AgriConnect.repository.GovernmentSchemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GovernmentSchemeService {

    private final GovernmentSchemeRepository repository;
    private final DepartmentRepository departmentRepository;

    public SchemeResponse addScheme(SchemeRequest request) {

        Department department = resolveDepartment(request.getDepartmentId());

        GovernmentScheme scheme = GovernmentScheme.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .state(request.getState())
                .category(request.getCategory())
                .applyLink(request.getApplyLink())
                .department(department)
                .eligibilityCriteria(request.getEligibilityCriteria())
                .active(true)
                .build();

        GovernmentScheme saved = repository.save(scheme);

        return mapToResponse(saved);
    }

    public SchemeResponse updateScheme(Long id, SchemeRequest request) {

        GovernmentScheme scheme = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        scheme.setTitle(request.getTitle());
        scheme.setDescription(request.getDescription());
        scheme.setState(request.getState());
        scheme.setCategory(request.getCategory());
        scheme.setApplyLink(request.getApplyLink());
        scheme.setDepartment(resolveDepartment(request.getDepartmentId()));
        scheme.setEligibilityCriteria(request.getEligibilityCriteria());

        return mapToResponse(repository.save(scheme));
    }

    public List<SchemeResponse> getAllSchemes() {
        return repository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Government's own management view — includes deactivated schemes too,
    // unlike the public/farmer-facing getAllSchemes() above.
    public List<SchemeResponse> getAllForManagement() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<SchemeResponse> getByState(String state) {
        return repository.findByStateIgnoreCase(state)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void deactivate(Long id) {

        GovernmentScheme scheme = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        scheme.setActive(false);
        repository.save(scheme);
    }

    public void reactivate(Long id) {

        GovernmentScheme scheme = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        scheme.setActive(true);
        repository.save(scheme);
    }

    private Department resolveDepartment(Long departmentId) {
        if (departmentId == null) return null;
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    private SchemeResponse mapToResponse(GovernmentScheme s) {

        return SchemeResponse.builder()
                .id(s.getId())
                .title(s.getTitle())
                .description(s.getDescription())
                .state(s.getState())
                .category(s.getCategory())
                .applyLink(s.getApplyLink())
                .active(s.isActive())
                .departmentId(s.getDepartment() != null ? s.getDepartment().getId() : null)
                .departmentName(s.getDepartment() != null ? s.getDepartment().getName() : null)
                .eligibilityCriteria(s.getEligibilityCriteria())
                .build();
    }
}
