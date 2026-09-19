package com.example.AgriConnect.service;

import com.example.AgriConnect.entity.AuditLog;
import com.example.AgriConnect.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepo;

    /**
     * Records a governance-relevant action — who did what, from where.
     * Call this from admin/super-admin actions (approvals, deletions,
     * suspensions, payouts) rather than every read request, so the log
     * stays a meaningful trail instead of noise.
     */
    public void log(String action) {
        String username = "system";
        try {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception ignored) {
        }

        String endpoint = null;
        String ip = null;
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                endpoint = request.getRequestURI();
                ip = request.getRemoteAddr();
            }
        } catch (Exception ignored) {
        }

        auditLogRepo.save(AuditLog.builder()
                .username(username)
                .action(action)
                .endpoint(endpoint)
                .ipAddress(ip)
                .build());
    }
}
