package com.example.hiveptit.dto;

import java.time.LocalDateTime;
import java.util.List;

public class FeedPostResponse {
    private Integer postId;
    private String title;
    private String content;
    private Integer voteCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private String authorUsername;
    private String authorFirstname;
    private String authorLastname;
    private String authorAvatarUrl;
    
    private List<String> topics;
    private Integer commentCount;
    private Double trendingScore;

    public FeedPostResponse() {
    }

    public FeedPostResponse(Integer postId, String title, String content, Integer voteCount,
                           LocalDateTime createdAt, LocalDateTime updatedAt,
                           String authorUsername, String authorFirstname, String authorLastname,
                           String authorAvatarUrl, List<String> topics, Integer commentCount,
                           Double trendingScore) {
        this.postId = postId;
        this.title = title;
        this.content = content;
        this.voteCount = voteCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.authorUsername = authorUsername;
        this.authorFirstname = authorFirstname;
        this.authorLastname = authorLastname;
        this.authorAvatarUrl = authorAvatarUrl;
        this.topics = topics;
        this.commentCount = commentCount;
        this.trendingScore = trendingScore;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(Integer voteCount) {
        this.voteCount = voteCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public String getAuthorFirstname() {
        return authorFirstname;
    }

    public void setAuthorFirstname(String authorFirstname) {
        this.authorFirstname = authorFirstname;
    }

    public String getAuthorLastname() {
        return authorLastname;
    }

    public void setAuthorLastname(String authorLastname) {
        this.authorLastname = authorLastname;
    }

    public String getAuthorAvatarUrl() {
        return authorAvatarUrl;
    }

    public void setAuthorAvatarUrl(String authorAvatarUrl) {
        this.authorAvatarUrl = authorAvatarUrl;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public Integer getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }

    public Double getTrendingScore() {
        return trendingScore;
    }

    public void setTrendingScore(Double trendingScore) {
        this.trendingScore = trendingScore;
    }
}
