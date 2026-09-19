package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NoticeResponse {
    private Long id;
    private String title;
    private String content;
    private Long departmentId;
    private String departmentName;
    private String targetRole;
    private boolean active;
    private String createdByName;
    private LocalDateTime createdAt;
}
