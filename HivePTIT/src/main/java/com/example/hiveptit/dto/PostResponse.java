package com.example.hiveptit.dto;

import java.time.Instant;
import java.util.List;

public class PostResponse {
    private Integer id;
    private String title;
    private String content; // HTML hoặc Markdown tùy vào usecase
    private String rawContent; // Markdown gốc (chỉ trả về khi cần edit)
    private List<TopicSummary> topics;
    private UserSummaryDTO author;
    private Instant createdAt;
    private Instant updatedAt;
    private Integer voteCount;

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

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Integer getVoteCount() { return voteCount; }
    public void setVoteCount(Integer voteCount) { this.voteCount = voteCount; }
}