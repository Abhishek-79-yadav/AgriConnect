package com.example.AgriConnect.mapper;

import com.example.AgriConnect.dto.response.NotificationResponse;
import com.example.AgriConnect.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification n){

        return NotificationResponse.builder()
                .id(n.getId())
                .message(n.getMessage())
                .readStatus(n.isReadStatus())
                .build();
    }
}