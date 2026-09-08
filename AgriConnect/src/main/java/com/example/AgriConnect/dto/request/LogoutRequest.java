package com.example.AgriConnect.dto.request;

import lombok.Data;

@Data
public class LogoutRequest {

    // Optional: if the frontend sends it, we revoke it too so the refresh
    // token can't be used to mint new access tokens after logout.
    private String refreshToken;
}