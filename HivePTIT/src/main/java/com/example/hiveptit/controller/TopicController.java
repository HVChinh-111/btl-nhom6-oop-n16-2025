package com.example.hiveptit.controller;

import com.example.hiveptit.dto.TopicRequest;
import com.example.hiveptit.dto.TopicResponse;
import com.example.hiveptit.service.TopicService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    // Public: lấy danh sách tất cả chủ đề
    @GetMapping
    public List<TopicResponse> getAllTopics() {
        return topicService.getAll();
    }

    // MẶC ĐỊNH: Chỉ ADMIN được thêm chủ đề
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public TopicResponse createTopic(@Valid @RequestBody TopicRequest request) {
        return topicService.create(request);
    }
}