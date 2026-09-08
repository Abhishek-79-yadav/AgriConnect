package com.example.AgriConnect.dto.response;
import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class PageResponse<T> {

    private List<T> content;

    private int page;

    private int size;

    private long totalElements;

    private int totalPages;

}
