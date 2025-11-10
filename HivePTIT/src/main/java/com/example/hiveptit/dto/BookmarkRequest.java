package com.example.hiveptit.dto;

public class BookmarkRequest {
    private String listName;
    private Integer postId;

    public BookmarkRequest() {
    }

    public BookmarkRequest(String listName, Integer postId) {
        this.listName = listName;
        this.postId = postId;
    }

    public String getListName() {
        return listName;
    }

    public void setListName(String listName) {
        this.listName = listName;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }
}
