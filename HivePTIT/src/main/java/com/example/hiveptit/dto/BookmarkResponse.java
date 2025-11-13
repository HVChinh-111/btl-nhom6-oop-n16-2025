package com.example.hiveptit.dto;

import java.time.LocalDateTime;

public class BookmarkResponse {
    private String message;
    private boolean success;
    private Integer listId;
    private String listName;
    private LocalDateTime createdAt;

    public BookmarkResponse() {
    }

    public BookmarkResponse(String message, boolean success, Integer listId, String listName, LocalDateTime createdAt) {
        this.message = message;
        this.success = success;
        this.listId = listId;
        this.listName = listName;
        this.createdAt = createdAt;
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

    public Integer getListId() {
        return listId;
    }

    public void setListId(Integer listId) {
        this.listId = listId;
    }

    public String getListName() {
        return listName;
    }

    public void setListName(String listName) {
        this.listName = listName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
