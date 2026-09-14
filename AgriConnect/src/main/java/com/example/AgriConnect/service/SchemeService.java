package com.example.AgriConnect.service;

import com.example.AgriConnect.entity.GovernmentScheme;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.repository.GovernmentSchemeRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchemeService {

    private final GovernmentSchemeRepository repo;
    private final UserRepository userRepository;

    public List<GovernmentScheme> recommend(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        String state = user.getState();

        return repo.findByStateIgnoreCase(state);
    }
}
