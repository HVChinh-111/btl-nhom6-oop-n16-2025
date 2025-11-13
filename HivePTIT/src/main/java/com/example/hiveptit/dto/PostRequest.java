package com.example.hiveptit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class PostRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề không được vượt quá 255 ký tự")
    private String title;

    @NotBlank(message = "Nội dung không được để trống")
    private String content;

    // Danh sách id chủ đề (topic) gắn cho bài viết
    private List<Integer> topicIds;

    public String getTitle() {
        return title;
    }

    // ... existing code ...
    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    public List<Integer> getTopicIds() {
        return topicIds;
    }
    public void setTopicIds(List<Integer> topicIds) {
        this.topicIds = topicIds;
    }
}