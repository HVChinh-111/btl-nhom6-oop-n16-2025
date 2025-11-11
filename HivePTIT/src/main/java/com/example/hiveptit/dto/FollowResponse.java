package com.example.hiveptit.dto;

public class FollowResponse {
    private String message;
    private boolean success;
    private String action;
    private Long followerCount;
    private Long followingCount;

    public FollowResponse() {
    }

    public FollowResponse(String message, boolean success, String action, Long followerCount, Long followingCount) {
        this.message = message;
        this.success = success;
        this.action = action;
        this.followerCount = followerCount;
        this.followingCount = followingCount;
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

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Long getFollowerCount() {
        return followerCount;
    }

    public void setFollowerCount(Long followerCount) {
        this.followerCount = followerCount;
    }

    public Long getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(Long followingCount) {
        this.followingCount = followingCount;
    }
}
