package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.response.WalletResponse;
import com.example.AgriConnect.dto.response.WalletTransactionResponse;
import com.example.AgriConnect.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<WalletResponse> getWallet(Authentication auth) {
        return ResponseEntity.ok(walletService.getWallet(auth.getName()));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<WalletTransactionResponse>> getTransactions(Authentication auth) {
        return ResponseEntity.ok(walletService.getTransactions(auth.getName()));
    }
}
