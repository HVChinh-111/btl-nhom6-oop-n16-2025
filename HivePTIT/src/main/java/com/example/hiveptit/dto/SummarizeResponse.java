package com.example.hiveptit.dto;

public class SummarizeResponse {
    private String summary;
    private Integer postId;
    
    public SummarizeResponse() {}
    
    public SummarizeResponse(String summary, Integer postId) {
        this.summary = summary;
        this.postId = postId;
    }
    
    public String getSummary() {
        return summary;
    }
    
    public void setSummary(String summary) {
        this.summary = summary;
    }
    
    public Integer getPostId() {
        return postId;
    }
    
    public void setPostId(Integer postId) {
        this.postId = postId;
    }
}
