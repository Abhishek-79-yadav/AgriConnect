package com.example.AgriConnect.mapper;

import com.example.AgriConnect.dto.response.UserResponse;
import com.example.AgriConnect.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .city(user.getCity())
                .state(user.getState())
                .role(user.getRole().name())
                .build();
    }
}