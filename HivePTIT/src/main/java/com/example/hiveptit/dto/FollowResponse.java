package com.example.hiveptit.dto;

public class FollowResponse {
    private String message;
    private boolean success;
    private String action;
    private Integer followerCount;
    private Integer followingCount;

    public FollowResponse() {
    }

    public FollowResponse(String message, boolean success, String action, Integer followerCount, Integer followingCount) {
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

    public Integer getFollowerCount() {
        return followerCount;
    }

    public void setFollowerCount(Integer followerCount) {
        this.followerCount = followerCount;
    }

    public Integer getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(Integer followingCount) {
        this.followingCount = followingCount;
    }
}
