package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.request.ChangePasswordRequest;
import com.example.AgriConnect.dto.request.UpdateProfileRequest;
import com.example.AgriConnect.dto.response.UserResponse;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.RefreshTokenRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;

    // ENTITY ONLY (internal use)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToResponse(user);
    }

    public UserResponse getProfile(String email) {

        User user = getUserByEmail(email);

        return mapToResponse(user);
    }

    // UPDATE PROFILE
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {

        User user = getUserByEmail(email);

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getMobile() != null) {
            user.setMobile(request.getMobile());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }
        if (request.getState() != null) {
            user.setState(request.getState());
        }

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    // CHANGE PASSWORD
    public void changePassword(String email, ChangePasswordRequest request) {

        User user = getUserByEmail(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ApiException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // DEACTIVATE (self-service, reversible by logging back in — see AuthService.login)
    public void deactivateAccount(String email) {

        User user = getUserByEmail(email);

        if (!user.isEnabled()) {
            throw new ApiException("This account is already disabled");
        }

        user.setEnabled(false);
        user.setDeactivatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        // Sign the account out everywhere — a deactivated account
        // shouldn't keep working via a refresh token issued before now.
        refreshTokenRepository.deleteByEmail(email);
    }

    // DELETE (self-service, NOT reversible). Personal data is anonymized
    // rather than the row being hard-deleted — see the note on
    // User.deletionRequestedAt for why.
    public void deleteAccount(String email, com.example.AgriConnect.dto.request.DeleteAccountRequest request) {

        User user = getUserByEmail(email);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException("Incorrect password");
        }

        if (user.getRole() == com.example.AgriConnect.entity.Role.SUPER_ADMIN) {
            throw new ApiException("Super admin accounts can't be self-deleted");
        }

        user.setName("Deleted user");
        user.setEmail("deleted_" + user.getId() + "@deleted.agriconnect.local");
        user.setMobile(null);
        user.setAddress(null);
        user.setCity(null);
        user.setState(null);
        user.setProfileImage(null);
        user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
        user.setEnabled(false);
        user.setDeletionRequestedAt(java.time.LocalDateTime.now());

        userRepository.save(user);
        refreshTokenRepository.deleteByEmail(email);
    }

    // SINGLE MAPPER (reuse everywhere)
    private UserResponse mapToResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .state(user.getState())
                .build();
    }
}
