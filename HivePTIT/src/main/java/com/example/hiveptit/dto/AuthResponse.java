package com.example.hiveptit.dto;

public class AuthResponse {
    private String token;        
    private String studentId;
    private String username;
    private String email;
    private String message;
    private boolean success;

    public AuthResponse() {
    }

    public AuthResponse(String token, String studentId, String username, String email, 
                       String message, boolean success) {
        this.token = token;
        this.studentId = studentId;
        this.username = username;
        this.email = email;
        this.message = message;
        this.success = success;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
