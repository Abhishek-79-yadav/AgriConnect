package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.FarmerPayoutResponse;
import com.example.AgriConnect.dto.response.OrderResponse;
import com.example.AgriConnect.dto.response.RiskFlagResponse;
import com.example.AgriConnect.entity.AgriInput;
import com.example.AgriConnect.entity.AuditLog;
import com.example.AgriConnect.entity.Product;
import com.example.AgriConnect.entity.Role;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.AgriInputRepository;
import com.example.AgriConnect.repository.AuditLogRepository;
import com.example.AgriConnect.repository.ProductRepository;
import com.example.AgriConnect.repository.UserRepository;
import com.example.AgriConnect.service.AuditService;
import com.example.AgriConnect.service.OrderService;
import com.example.AgriConnect.service.PayoutService;
import com.example.AgriConnect.service.RiskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final AgriInputRepository agriInputRepo;
    private final AuditLogRepository auditLogRepo;
    private final OrderService orderService;
    private final PayoutService payoutService;
    private final RiskService riskService;
    private final AuditService auditService;
    private final com.example.AgriConnect.service.SupportTicketService supportTicketService;

    // All Users
    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    // All Products
    @GetMapping("/products")
    public List<Product> getProducts() {
        return productRepo.findAll();
    }

    // All Orders
    @GetMapping("/orders")
    public List<OrderResponse> getOrders() {
        return orderService.getAllOrders();
    }

    // Delete User
    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        auditService.log("Deleted user #" + id);
        return "User Deleted";
    }

    // Delete Product
    @DeleteMapping("/product/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productRepo.deleteById(id);
        auditService.log("Deleted product #" + id);
        return "Product Deleted";
    }

    // How much each farmer is owed (from paid orders) vs already paid out.
    @GetMapping("/payouts")
    public List<FarmerPayoutResponse> getPayouts() {
        return payoutService.getPayoutSummary();
    }

    // Mark one order line as paid out to its farmer (manual payout —
    // actual bank transfer happens outside the app for now).
    @PutMapping("/payouts/{orderItemId}/mark-paid")
    public String markPaidOut(@PathVariable Long orderItemId) {
        payoutService.markPaidOut(orderItemId);
        auditService.log("Marked order item #" + orderItemId + " as paid out");
        return "Marked as paid out";
    }

    // BRAND accounts start disabled (see AuthService.registerBrand) — this
    // lists everyone still waiting.
    @GetMapping("/brands/pending")
    public List<User> getPendingBrands() {
        return userRepo.findAll().stream()
                .filter(u -> u.getRole() == Role.BRAND && !u.isEnabled() && u.getSuspensionReason() == null)
                .toList();
    }

    @PutMapping("/brands/{id}/approve")
    public String approveBrand(@PathVariable Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ApiException("User not found"));

        if (user.getRole() != Role.BRAND) {
            throw new ApiException("User is not a brand account");
        }

        user.setEnabled(true);
        userRepo.save(user);
        auditService.log("Approved brand account #" + id + " (" + user.getEmail() + ")");
        return "Brand approved";
    }

    // ---------------- Account suspension (governance) ----------------

    @PutMapping("/users/{id}/suspend")
    public String suspendUser(@PathVariable Long id, @RequestParam String reason) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ApiException("User not found"));

        if (user.getRole() == Role.SUPER_ADMIN) {
            throw new ApiException("Cannot suspend a super admin account");
        }

        user.setEnabled(false);
        user.setSuspensionReason(reason);
        userRepo.save(user);
        auditService.log("Suspended user #" + id + " (" + user.getEmail() + "): " + reason);
        return "User suspended";
    }

    @PutMapping("/users/{id}/unsuspend")
    public String unsuspendUser(@PathVariable Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ApiException("User not found"));

        user.setEnabled(true);
        user.setSuspensionReason(null);
        userRepo.save(user);
        auditService.log("Unsuspended user #" + id + " (" + user.getEmail() + ")");
        return "User unsuspended";
    }

    @GetMapping("/users/suspended")
    public List<User> getSuspendedUsers() {
        return userRepo.findAll().stream()
                .filter(u -> u.getSuspensionReason() != null)
                .toList();
    }

    // ---------------- Listing moderation (governance) ----------------

    @GetMapping("/products/pending")
    public List<Product> getPendingProducts() {
        return productRepo.findAll().stream().filter(p -> !p.isApproved()).toList();
    }

    @PutMapping("/products/{id}/approve")
    public String approveProduct(@PathVariable Long id) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new ApiException("Product not found"));
        product.setApproved(true);
        productRepo.save(product);
        auditService.log("Approved product #" + id);
        return "Product approved";
    }

    @GetMapping("/agri-inputs/pending")
    public List<AgriInput> getPendingAgriInputs() {
        return agriInputRepo.findAll().stream().filter(a -> !a.isApproved()).toList();
    }

    @PutMapping("/agri-inputs/{id}/approve")
    public String approveAgriInput(@PathVariable Long id) {
        AgriInput input = agriInputRepo.findById(id)
                .orElseThrow(() -> new ApiException("Listing not found"));
        input.setApproved(true);
        agriInputRepo.save(input);
        auditService.log("Approved agri-input listing #" + id);
        return "Listing approved";
    }

    // ---------------- Risk flags (governance) ----------------

    @GetMapping("/risk-flags")
    public List<RiskFlagResponse> getRiskFlags() {
        return riskService.getFlags();
    }

    // ---------------- Support tickets (Help Center) ----------------

    @GetMapping("/support/tickets")
    public List<com.example.AgriConnect.dto.response.SupportTicketResponse> getSupportTickets() {
        return supportTicketService.getAll();
    }

    @PutMapping("/support/tickets/{id}/resolve")
    public com.example.AgriConnect.dto.response.SupportTicketResponse resolveSupportTicket(
            @PathVariable Long id,
            @RequestParam String response) {
        return supportTicketService.resolve(id, response);
    }

    // ---------------- Audit log (governance) ----------------
    // Kept read-only here; the write side is AuditService.log(), called
    // from every mutating admin action above plus a few other services.

    @GetMapping("/audit-logs")
    public List<AuditLog> getAuditLogs() {
        return auditLogRepo.findAll(
                PageRequest.of(0, 200, Sort.by(Sort.Direction.DESC, "id"))
        ).getContent();
    }
}
