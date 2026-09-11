package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.NoticeRequest;
import com.example.AgriConnect.dto.response.NoticeResponse;
import com.example.AgriConnect.entity.CampaignTargetRole;
import com.example.AgriConnect.entity.Department;
import com.example.AgriConnect.entity.GovernmentNotice;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.DepartmentRepository;
import com.example.AgriConnect.repository.GovernmentNoticeRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GovernmentNoticeService {

    private final GovernmentNoticeRepository noticeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public NoticeResponse create(String email, NoticeRequest request) {

        User official = getUser(email);
        Department department = resolveDepartment(request.getDepartmentId());

        GovernmentNotice notice = GovernmentNotice.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .department(department)
                .targetRole(parseTargetRole(request.getTargetRole()))
                .active(true)
                .createdBy(official)
                .build();

        return mapToResponse(noticeRepository.save(notice));
    }

    public void setActive(Long id, boolean active) {
        GovernmentNotice notice = getNotice(id);
        notice.setActive(active);
        noticeRepository.save(notice);
    }

    // Government's own management view — active and inactive notices.
    public List<NoticeResponse> getAll() {
        return noticeRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).toList();
    }

    // Public/farmer-facing — active notices only.
    public List<NoticeResponse> getActive() {
        return noticeRepository.findByActiveTrueOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).toList();
    }

    private Department resolveDepartment(Long id) {
        if (id == null) return null;
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    private CampaignTargetRole parseTargetRole(String value) {
        if (value == null || value.isBlank()) return CampaignTargetRole.ALL;
        try {
            return CampaignTargetRole.valueOf(value.toUpperCase());
        } catch (Exception e) {
            throw new ApiException("Invalid target role: " + value);
        }
    }

    private GovernmentNotice getNotice(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found"));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private NoticeResponse mapToResponse(GovernmentNotice n) {
        return NoticeResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .content(n.getContent())
                .departmentId(n.getDepartment() != null ? n.getDepartment().getId() : null)
                .departmentName(n.getDepartment() != null ? n.getDepartment().getName() : null)
                .targetRole(n.getTargetRole().name())
                .active(n.isActive())
                .createdByName(n.getCreatedBy() != null ? n.getCreatedBy().getName() : null)
                .createdAt(n.getCreatedAt())
                .build();
    }
}
