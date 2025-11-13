package com.example.hiveptit.service;

import com.example.hiveptit.dto.TopicRequest;
import com.example.hiveptit.dto.TopicResponse;
import com.example.hiveptit.model.Topics;
import com.example.hiveptit.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TopicService {

    private final TopicRepository topicRepository;

    public TopicService(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    // lấy all topic
    @Transactional(readOnly = true)
    public List<TopicResponse> getAll() {
        return topicRepository.findAll().stream()
                .map(t -> new TopicResponse(t.getName()))
                .toList();
    }
    // tạo topic (admin)
    @Transactional
    public TopicResponse create(TopicRequest request) {
        Topics topic = new Topics();
        topic.setName(request.getName());
        Topics saved = topicRepository.save(topic);
        return new TopicResponse(saved.getName());
    }
}