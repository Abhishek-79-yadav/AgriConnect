package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.DepartmentRequest;
import com.example.AgriConnect.dto.request.NoticeRequest;
import com.example.AgriConnect.dto.request.TaxConfigRequest;
import com.example.AgriConnect.dto.response.DepartmentResponse;
import com.example.AgriConnect.dto.response.GovernmentReportResponse;
import com.example.AgriConnect.dto.response.NoticeResponse;
import com.example.AgriConnect.dto.response.TaxConfigResponse;
import com.example.AgriConnect.entity.AuditLog;
import com.example.AgriConnect.repository.AuditLogRepository;
import com.example.AgriConnect.service.DepartmentService;
import com.example.AgriConnect.service.GovernmentNoticeService;
import com.example.AgriConnect.service.GovernmentReportService;
import com.example.AgriConnect.service.TaxConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Everything in the government module that's simple lookup/reference data
// (departments, notices, tax rate config) plus reporting and audit trail
// visibility — the bigger workflows (schemes, applications, warehouse
// licenses) each have their own controller.
@RestController
@RequiredArgsConstructor
public class GovernmentController {

    private final DepartmentService departmentService;
    private final GovernmentNoticeService noticeService;
    private final TaxConfigService taxConfigService;
    private final GovernmentReportService reportService;
    private final AuditLogRepository auditLogRepo;

    // ---------------- Departments ----------------

    @PostMapping("/api/government/departments")
    public ResponseEntity<DepartmentResponse> createDepartment(@RequestBody @Valid DepartmentRequest request) {
        return ResponseEntity.ok(departmentService.create(request));
    }

    @PutMapping("/api/government/departments/{id}")
    public ResponseEntity<DepartmentResponse> updateDepartment(
            @PathVariable Long id, @RequestBody @Valid DepartmentRequest request) {
        return ResponseEntity.ok(departmentService.update(id, request));
    }

    @PutMapping("/api/government/departments/{id}/status")
    public ResponseEntity<Void> setDepartmentActive(@PathVariable Long id, @RequestParam boolean active) {
        departmentService.setActive(id, active);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/government/departments")
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAll());
    }

    // Public — used by scheme/notice forms and browse pages alike.
    @GetMapping("/api/departments/active")
    public ResponseEntity<List<DepartmentResponse>> getActiveDepartments() {
        return ResponseEntity.ok(departmentService.getActive());
    }

    // ---------------- Notices ----------------

    @PostMapping("/api/government/notices")
    public ResponseEntity<NoticeResponse> createNotice(
            @RequestBody @Valid NoticeRequest request, Authentication auth) {
        return ResponseEntity.ok(noticeService.create(auth.getName(), request));
    }

    @PutMapping("/api/government/notices/{id}/status")
    public ResponseEntity<Void> setNoticeActive(@PathVariable Long id, @RequestParam boolean active) {
        noticeService.setActive(id, active);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/government/notices")
    public ResponseEntity<List<NoticeResponse>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAll());
    }

    // Public — farmers/buyers see only active notices.
    @GetMapping("/api/notices/active")
    public ResponseEntity<List<NoticeResponse>> getActiveNotices() {
        return ResponseEntity.ok(noticeService.getActive());
    }

    // ---------------- Tax configuration ----------------

    @PostMapping("/api/government/tax-config")
    public ResponseEntity<TaxConfigResponse> createTaxConfig(
            @RequestBody @Valid TaxConfigRequest request, Authentication auth) {
        return ResponseEntity.ok(taxConfigService.create(auth.getName(), request));
    }

    @PutMapping("/api/government/tax-config/{id}")
    public ResponseEntity<TaxConfigResponse> updateTaxConfig(
            @PathVariable Long id, @RequestBody @Valid TaxConfigRequest request) {
        return ResponseEntity.ok(taxConfigService.update(id, request));
    }

    @PutMapping("/api/government/tax-config/{id}/status")
    public ResponseEntity<Void> setTaxConfigActive(@PathVariable Long id, @RequestParam boolean active) {
        taxConfigService.setActive(id, active);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/government/tax-config")
    public ResponseEntity<List<TaxConfigResponse>> getAllTaxConfig() {
        return ResponseEntity.ok(taxConfigService.getAll());
    }

    // Public — anyone can look up the current applicable rates.
    @GetMapping("/api/tax-config/active")
    public ResponseEntity<List<TaxConfigResponse>> getActiveTaxConfig() {
        return ResponseEntity.ok(taxConfigService.getActive());
    }

    // ---------------- Reports ----------------

    @GetMapping("/api/government/reports/summary")
    public ResponseEntity<GovernmentReportResponse> getReportSummary() {
        return ResponseEntity.ok(reportService.getSummary());
    }

    // ---------------- Audit trail ----------------
    // Same underlying log as the admin Governance page — government
    // officials are an equally trusted internal role, so no filtering
    // beyond what ADMIN already sees.

    @GetMapping("/api/government/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(
                auditLogRepo.findAll(PageRequest.of(0, 200, Sort.by(Sort.Direction.DESC, "id"))).getContent()
        );
    }
}
