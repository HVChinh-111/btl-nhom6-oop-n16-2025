package com.example.hiveptit.controller;

import com.example.hiveptit.dto.FeedPostResponse;
import com.example.hiveptit.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    @Autowired
    private FeedService feedService;

    @GetMapping("/following")
    public ResponseEntity<List<FeedPostResponse>> getFollowingFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        
        List<FeedPostResponse> feed = feedService.getFollowingFeed(username, page, size);
        return ResponseEntity.ok(feed);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<FeedPostResponse>> getTrendingFeed() {
        
        List<FeedPostResponse> feed = feedService.getTrendingFeed();
        return ResponseEntity.ok(feed);
    }

    @GetMapping("/home")
    public ResponseEntity<List<FeedPostResponse>> getHomeFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<FeedPostResponse> feed = feedService.getHomeFeed(page, size);
        return ResponseEntity.ok(feed);
    }

    @GetMapping("/topic/{topicName}")
    public ResponseEntity<List<FeedPostResponse>> getTopicFeed(
            @PathVariable String topicName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<FeedPostResponse> feed = feedService.getTopicFeed(topicName, page, size);
        return ResponseEntity.ok(feed);
    }
}
