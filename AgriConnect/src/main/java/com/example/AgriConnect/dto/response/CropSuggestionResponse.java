package com.example.AgriConnect.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CropSuggestionResponse {

    private String recommendedCrop;
    private String reason;
    private int confidence; // 0-100

    // Runner-up options, most to least suitable, so the farmer isn't
    // locked into a single suggestion with no visibility into why it beat
    // the alternatives.
    private List<RankedCrop> alternatives;

    @Data
    @Builder
    public static class RankedCrop {
        private String crop;
        private int score;
        private String reason;
    }
}