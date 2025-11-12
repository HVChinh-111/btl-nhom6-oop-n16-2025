package com.example.hiveptit.dto;

public class UpdateProfileResponse {
    private String message;
    private boolean success;
    private UserProfileResponse user;

    public UpdateProfileResponse() {
    }

    public UpdateProfileResponse(String message, boolean success, UserProfileResponse user) {
        this.message = message;
        this.success = success;
        this.user = user;
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

    public UserProfileResponse getUser() {
        return user;
    }

    public void setUser(UserProfileResponse user) {
        this.user = user;
    }
}
