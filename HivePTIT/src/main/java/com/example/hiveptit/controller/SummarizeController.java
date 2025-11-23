package com.example.hiveptit.controller;

import com.example.hiveptit.dto.SummarizeResponse;
import com.example.hiveptit.service.NvidiaAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class SummarizeController {

    @Autowired
    private NvidiaAiService nvidiaAiService;
    
    @PostMapping("/{postId}/summarize")
    public ResponseEntity<SummarizeResponse> summarizePost(@PathVariable Integer postId) {
        try {
            SummarizeResponse response = nvidiaAiService.summarizePost(postId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new SummarizeResponse(e.getMessage(), postId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new SummarizeResponse("Error calling AI service: " + e.getMessage(), postId));
        }
    }
}
