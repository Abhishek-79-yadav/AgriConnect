package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.RefundResponse;
import com.example.AgriConnect.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/refunds")
@RequiredArgsConstructor
public class RefundController {

    private final RefundService refundService;

    @GetMapping("/buyer")
    public ResponseEntity<List<RefundResponse>> getBuyerRefunds(Authentication auth) {
        return ResponseEntity.ok(refundService.getBuyerRefunds(auth.getName()));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<RefundResponse>> getAllRefunds(Authentication auth) {
        return ResponseEntity.ok(refundService.getAllRefunds(auth.getName()));
    }
}
