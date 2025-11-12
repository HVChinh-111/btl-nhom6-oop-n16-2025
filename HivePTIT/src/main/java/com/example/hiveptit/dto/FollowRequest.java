package com.example.hiveptit.dto;

public class FollowRequest {
    private String targetUsername;

    public FollowRequest() {
    }

    public FollowRequest(String targetUsername) {
        this.targetUsername = targetUsername;
    }

    public String getTargetUsername() {
        return targetUsername;
    }

    public void setTargetUsername(String targetUsername) {
        this.targetUsername = targetUsername;
    }
}
