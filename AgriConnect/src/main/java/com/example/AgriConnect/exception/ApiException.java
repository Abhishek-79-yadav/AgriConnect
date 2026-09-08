package com.example.AgriConnect.exception;

public class ApiException extends RuntimeException {
    public ApiException(String message) {
        super(message);
    }
}