package com.example.hiveptit.dto;

public class AuthResponse {
    private String studentId;
    private String username;
    private String email;
    private String message;
    private boolean success;

    public AuthResponse() {
    }

    public AuthResponse(String studentId, String username, String email, String message, boolean success) {
        this.studentId = studentId;
        this.username = username;
        this.email = email;
        this.message = message;
        this.success = success;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }

    public boolean isSuccess() {
        return success;
    }
}
