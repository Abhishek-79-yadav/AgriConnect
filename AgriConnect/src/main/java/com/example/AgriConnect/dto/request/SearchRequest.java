package com.example.AgriConnect.dto.request;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
public class SearchRequest {

    private String keyword;

    private String category;

    private String city;

    private int page = 0;

    private int size = 10;

}
