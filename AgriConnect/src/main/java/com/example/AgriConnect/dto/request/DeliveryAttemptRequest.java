package com.example.AgriConnect.dto.request;

import lombok.Data;

// Records one delivery attempt — the real-world case missing from the old
// flat-field tracking entirely. On success, recipientName is captured as
// proof of delivery; on failure, reason explains why (e.g. "recipient
// unavailable") so it shows up on the buyer's tracking timeline and the
// farmer knows to expect a re-attempt.
@Data
public class DeliveryAttemptRequest {
    private boolean successful;
    private String recipientName;
    private String reason;
    private String note;
}
