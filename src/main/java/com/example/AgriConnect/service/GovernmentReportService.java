package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.GovernmentReportResponse;
import com.example.AgriConnect.entity.LicenseStatus;
import com.example.AgriConnect.entity.SchemeApplicationStatus;
import com.example.AgriConnect.entity.TaxRecordStatus;
import com.example.AgriConnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GovernmentReportService {

    private final GovernmentSchemeRepository schemeRepository;
    private final SchemeApplicationRepository applicationRepository;
    private final WarehouseLicenseRepository licenseRepository;
    private final TaxRecordRepository taxRecordRepository;
    private final GovernmentNoticeRepository noticeRepository;
    private final DepartmentRepository departmentRepository;

    // A single dashboard-style summary rather than several separate
    // report endpoints — every number here is a plain count/sum query,
    // no heavy aggregation, so one call is cheap and the frontend gets a
    // consistent snapshot instead of five requests that could each land
    // a moment apart.
    public GovernmentReportResponse getSummary() {

        long totalSchemes = schemeRepository.findAll().size();
        long activeSchemes = schemeRepository.findByActiveTrue().size();

        var taxRecords = taxRecordRepository.findAll();
        double totalTaxCollected = taxRecords.stream()
                .filter(t -> t.getStatus() == TaxRecordStatus.PAID)
                .mapToDouble(t -> t.getTaxAmount() == null ? 0.0 : t.getTaxAmount())
                .sum();
        double totalTaxPending = taxRecords.stream()
                .filter(t -> t.getStatus() == TaxRecordStatus.PENDING || t.getStatus() == TaxRecordStatus.OVERDUE)
                .mapToDouble(t -> t.getTaxAmount() == null ? 0.0 : t.getTaxAmount())
                .sum();

        return GovernmentReportResponse.builder()
                .totalSchemes(totalSchemes)
                .activeSchemes(activeSchemes)

                .totalApplications(applicationRepository.findAll().size())
                .submittedApplications(applicationRepository.countByStatus(SchemeApplicationStatus.SUBMITTED))
                .underReviewApplications(applicationRepository.countByStatus(SchemeApplicationStatus.UNDER_REVIEW))
                .approvedApplications(applicationRepository.countByStatus(SchemeApplicationStatus.APPROVED))
                .rejectedApplications(applicationRepository.countByStatus(SchemeApplicationStatus.REJECTED))

                .totalLicenses(licenseRepository.findAll().size())
                .pendingLicenses(licenseRepository.countByStatus(LicenseStatus.PENDING))
                .activeLicenses(licenseRepository.countByStatus(LicenseStatus.ACTIVE))
                .suspendedLicenses(licenseRepository.countByStatus(LicenseStatus.SUSPENDED))
                .cancelledLicenses(licenseRepository.countByStatus(LicenseStatus.CANCELLED))

                .totalTaxRecords(taxRecords.size())
                .pendingTaxRecords(taxRecordRepository.countByStatus(TaxRecordStatus.PENDING))
                .paidTaxRecords(taxRecordRepository.countByStatus(TaxRecordStatus.PAID))
                .overdueTaxRecords(taxRecordRepository.countByStatus(TaxRecordStatus.OVERDUE))
                .totalTaxCollected(totalTaxCollected)
                .totalTaxPending(totalTaxPending)

                .activeNotices(noticeRepository.findByActiveTrueOrderByCreatedAtDesc().size())
                .activeDepartments(departmentRepository.findByActiveTrueOrderByNameAsc().size())
                .build();
    }
}
