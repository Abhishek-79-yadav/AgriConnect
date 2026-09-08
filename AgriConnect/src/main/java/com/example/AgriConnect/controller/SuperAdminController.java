package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.CreateAdminRequest;
import com.example.AgriConnect.entity.Role;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.UserRepository;
import com.example.AgriConnect.service.AuditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final AuditService auditService;

    @GetMapping("/admins")
    public List<User> getAdmins() {
        return userRepo.findAll().stream()
                .filter(u -> (u.getRole() == Role.ADMIN || u.getRole() == Role.SUPER_ADMIN) && u.isEnabled())
                .toList();
    }

    // Admins created via /api/auth/register-admin start disabled — this
    // lists everyone still waiting on a super admin's decision.
    @GetMapping("/admins/pending")
    public List<User> getPendingAdmins() {
        return userRepo.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN && !u.isEnabled() && u.getSuspensionReason() == null)
                .toList();
    }

    @PutMapping("/admins/{id}/approve")
    public String approveAdmin(@PathVariable Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ApiException("User not found"));

        if (user.getRole() != Role.ADMIN) {
            throw new ApiException("User is not an admin account");
        }

        user.setEnabled(true);
        userRepo.save(user);
        auditService.log("Approved admin account: " + user.getEmail());
        return "Admin approved";
    }

    @PutMapping("/admins/{id}/reject")
    public String rejectAdmin(@PathVariable Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ApiException("User not found"));

        if (user.getRole() != Role.ADMIN || user.isEnabled()) {
            throw new ApiException("User is not a pending admin account");
        }

        userRepo.delete(user);
        auditService.log("Rejected admin application: " + user.getEmail());
        return "Admin application rejected";
    }

    @PostMapping("/admins")
    public String createAdmin(@Valid @RequestBody CreateAdminRequest request) {

        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new ApiException("Email already exists");
        }

        User admin = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .build();

        userRepo.save(admin);
        auditService.log("Created admin account: " + request.getEmail());
        return "Admin created";
    }

    @DeleteMapping("/admins/{id}")
    public String removeAdmin(@PathVariable Long id) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new ApiException("User not found"));

        if (user.getRole() == Role.SUPER_ADMIN) {
            throw new ApiException("Cannot delete a super admin account");
        }

        if (user.getRole() != Role.ADMIN) {
            throw new ApiException("User is not an admin account");
        }

        userRepo.delete(user);
        auditService.log("Removed admin account: " + user.getEmail());
        return "Admin removed";
    }

    // ---------------- Government officials ----------------
    // Unlike self-registered ADMIN accounts (which start disabled pending
    // approval), a government official account is created directly by a
    // super admin and is enabled immediately — there's no self-service
    // registration path for this role at all (see AuthService.
    // SELF_REGISTERABLE_ROLES).

    @GetMapping("/government-officials")
    public List<User> getGovernmentOfficials() {
        return userRepo.findAll().stream()
                .filter(u -> u.getRole() == Role.GOVERNMENT)
                .toList();
    }

    @PostMapping("/government-officials")
    public String createGovernmentOfficial(@Valid @RequestBody CreateAdminRequest request) {

        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new ApiException("Email already exists");
        }

        User official = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .role(Role.GOVERNMENT)
                .enabled(true)
                .build();

        userRepo.save(official);
        auditService.log("Created government official account: " + request.getEmail());
        return "Government official account created";
    }

    @DeleteMapping("/government-officials/{id}")
    public String removeGovernmentOfficial(@PathVariable Long id) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new ApiException("User not found"));

        if (user.getRole() != Role.GOVERNMENT) {
            throw new ApiException("User is not a government official account");
        }

        userRepo.delete(user);
        auditService.log("Removed government official account: " + user.getEmail());
        return "Government official removed";
    }
}
