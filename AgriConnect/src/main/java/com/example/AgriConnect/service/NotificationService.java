package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.NotificationResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.NotificationRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void createNotification(User user, String message) {

        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .readStatus(false)
                .build();

        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getUserNotificationsByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void markAsRead(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notification.setReadStatus(true);
        notificationRepository.save(notification);
    }

    private NotificationResponse mapToResponse(Notification n) {

        return NotificationResponse.builder()
                .id(n.getId())
                .message(n.getMessage())
                .readStatus(n.isReadStatus())
                .build();
    }
}