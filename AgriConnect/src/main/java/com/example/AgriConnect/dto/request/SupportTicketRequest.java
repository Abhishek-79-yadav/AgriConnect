package com.example.AgriConnect.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SupportTicketRequest {

    @NotBlank(message = "Please pick a category")
    private String category;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Please describe your issue")
    private String message;
}
