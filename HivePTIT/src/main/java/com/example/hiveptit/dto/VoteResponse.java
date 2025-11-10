package com.example.hiveptit.dto;

public class VoteResponse {
    private String message;
    private String action;
    private Integer totalScore;
    private boolean success;

    public VoteResponse() {
    }

    public VoteResponse(String message, String action, Integer totalScore, boolean success) {
        this.message = message;
        this.action = action;
        this.totalScore = totalScore;
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
