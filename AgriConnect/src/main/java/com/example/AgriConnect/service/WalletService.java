package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.WalletResponse;
import com.example.AgriConnect.dto.response.WalletTransactionResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.UserRepository;
import com.example.AgriConnect.repository.WalletRepository;
import com.example.AgriConnect.repository.WalletTransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// Every user's platform wallet — currently fed by refunds (buyer side)
// and payouts (farmer side). Kept as a single service so both sides of
// the platform's money movement go through the same ledger discipline:
// never mutate balance directly, always go through credit()/debit() so
// a WalletTransaction row is written alongside it.
@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final UserRepository userRepository;

    @Transactional
    public Wallet getOrCreateWallet(User user) {
        return walletRepository.findByUser_Id(user.getId())
                .orElseGet(() -> walletRepository.save(
                        Wallet.builder().user(user).balance(0.0).build()
                ));
    }

    @Transactional
    public Wallet credit(User user, double amount, String reason, String referenceType, Long referenceId) {
        if (amount <= 0) {
            throw new ApiException("Credit amount must be positive");
        }
        Wallet wallet = getOrCreateWallet(user);
        wallet.setBalance(wallet.getBalance() + amount);
        Wallet saved = walletRepository.save(wallet);

        walletTransactionRepository.save(
                WalletTransaction.builder()
                        .wallet(saved)
                        .type(WalletTransactionType.CREDIT)
                        .amount(amount)
                        .reason(reason)
                        .referenceType(referenceType)
                        .referenceId(referenceId)
                        .balanceAfter(saved.getBalance())
                        .build()
        );

        return saved;
    }

    @Transactional
    public Wallet debit(User user, double amount, String reason, String referenceType, Long referenceId) {
        if (amount <= 0) {
            throw new ApiException("Debit amount must be positive");
        }
        Wallet wallet = getOrCreateWallet(user);
        if (wallet.getBalance() < amount) {
            throw new ApiException("Insufficient wallet balance");
        }
        wallet.setBalance(wallet.getBalance() - amount);
        Wallet saved = walletRepository.save(wallet);

        walletTransactionRepository.save(
                WalletTransaction.builder()
                        .wallet(saved)
                        .type(WalletTransactionType.DEBIT)
                        .amount(amount)
                        .reason(reason)
                        .referenceType(referenceType)
                        .referenceId(referenceId)
                        .balanceAfter(saved.getBalance())
                        .build()
        );

        return saved;
    }

    public WalletResponse getWallet(String email) {
        User user = getUser(email);
        Wallet wallet = getOrCreateWallet(user);
        return WalletResponse.builder().balance(wallet.getBalance()).build();
    }

    public List<WalletTransactionResponse> getTransactions(String email) {
        User user = getUser(email);
        Wallet wallet = getOrCreateWallet(user);
        return walletTransactionRepository.findByWallet_IdOrderByCreatedAtDesc(wallet.getId())
                .stream()
                .map(t -> WalletTransactionResponse.builder()
                        .id(t.getId())
                        .type(t.getType().name())
                        .amount(t.getAmount())
                        .reason(t.getReason())
                        .referenceType(t.getReferenceType())
                        .referenceId(t.getReferenceId())
                        .balanceAfter(t.getBalanceAfter())
                        .createdAt(t.getCreatedAt())
                        .build())
                .toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
