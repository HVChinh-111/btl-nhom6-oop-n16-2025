package com.example.hiveptit.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PostResponse {
    private Integer id;
    private String title;
    private String content; 
    private String rawContent; // Markdown gốc (chỉ trả về khi cần edit)
    private List<TopicSummary> topics;
    private UserSummaryDTO author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer voteCount;
    private String userVoteType; // "UPVOTE", "DOWNVOTE", hoặc null

    public static class TopicSummary {
        private Integer id;
        private String name;

        public TopicSummary() {}
        public TopicSummary(Integer id, String name) {
            this.id = id;
            this.name = name;
        }
        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }


    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getRawContent() { return rawContent; }
    public void setRawContent(String rawContent) { this.rawContent = rawContent; }

    public List<TopicSummary> getTopics() { return topics; }
    public void setTopics(List<TopicSummary> topics) { this.topics = topics; }

    public UserSummaryDTO getAuthor() { return author; }
    public void setAuthor(UserSummaryDTO author) { this.author = author; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Integer getVoteCount() { return voteCount; }
    public void setVoteCount(Integer voteCount) { this.voteCount = voteCount; }

    public String getUserVoteType() { return userVoteType; }
    public void setUserVoteType(String userVoteType) { this.userVoteType = userVoteType; }
}