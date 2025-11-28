package com.example.hiveptit.service;

import com.example.hiveptit.dto.SummarizeResponse;
import com.example.hiveptit.model.Posts;
import com.example.hiveptit.repository.PostRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NvidiaAiService {
    private static final String NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
    private static final String API_KEY = "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";
    private static final String MODEL = "meta/llama-3.1-405b-instruct";
    
    @Autowired
    private PostRepository postRepository;
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    public NvidiaAiService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }
    
    public SummarizeResponse summarizePost(Integer postId) throws Exception {
        Posts post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        String content = post.getContent();
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Post content is empty");
        }
        
        String prompt = "Hãy tóm tắt nội dung sau đây một cách ngắn gọn và súc tích bằng tiếng Việt, chỉ nêu những ý chính:\n\n" + content;
        
        String summary = callNvidiaApi(prompt);
        
        return new SummarizeResponse(summary, postId);
    }
    
    private String callNvidiaApi(String userMessage) throws Exception {
        Map<String, Object> messageMap = new HashMap<>();
        messageMap.put("role", "user");
        messageMap.put("content", userMessage);
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", MODEL);
        requestBody.put("messages", List.of(messageMap));
        requestBody.put("temperature", 0.2);
        requestBody.put("top_p", 0.7);
        requestBody.put("max_tokens", 1024);
        requestBody.put("stream", false);
        
        String jsonBody = objectMapper.writeValueAsString(requestBody);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(NVIDIA_API_URL))
            .header("Authorization", "Bearer " + API_KEY)
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();
        
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() != 200) {
            throw new RuntimeException("NVIDIA API error: " + response.statusCode() + " - " + response.body());
        }
        
        JsonNode rootNode = objectMapper.readTree(response.body());
        JsonNode choicesNode = rootNode.path("choices");
        
        if (choicesNode.isArray() && choicesNode.size() > 0) {
            JsonNode firstChoice = choicesNode.get(0);
            JsonNode messageNode = firstChoice.path("message");
            String content = messageNode.path("content").asText();
            return content.trim();
        }
        
        throw new RuntimeException("Failed to extract summary from API response");
    }
}
