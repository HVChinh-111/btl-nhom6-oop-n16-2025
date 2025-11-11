package com.example.hiveptit.controller;

import com.example.hiveptit.dto.FollowRequest;
import com.example.hiveptit.dto.FollowResponse;
import com.example.hiveptit.dto.UserSummaryDTO;
import com.example.hiveptit.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/toggle")
    public ResponseEntity<FollowResponse> toggleFollow(
            @RequestBody FollowRequest request,
            Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String currentUsername = userDetails.getUsername();

        FollowResponse response = followService.toggleFollow(currentUsername, request.getTargetUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<List<UserSummaryDTO>> getFollowers(
            @PathVariable String username,
            Authentication authentication) {

        String currentUsername = null;
        if (authentication != null) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            currentUsername = userDetails.getUsername();
        }

        List<UserSummaryDTO> followers = followService.getFollowers(username, currentUsername);
        return ResponseEntity.ok(followers);
    }

    @GetMapping("/{username}/following")
    public ResponseEntity<List<UserSummaryDTO>> getFollowing(
            @PathVariable String username,
            Authentication authentication) {

        String currentUsername = null;
        if (authentication != null) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            currentUsername = userDetails.getUsername();
        }

        List<UserSummaryDTO> following = followService.getFollowing(username, currentUsername);
        return ResponseEntity.ok(following);
    }

    @GetMapping("/{username}/stats")
    public ResponseEntity<Map<String, Long>> getFollowStats(@PathVariable String username) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("followers", followService.getFollowerCount(username));
        stats.put("following", followService.getFollowingCount(username));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkFollowing(
            @RequestParam String targetUsername,
            Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String currentUsername = userDetails.getUsername();

        boolean isFollowing = followService.isFollowing(currentUsername, targetUsername);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isFollowing", isFollowing);
        return ResponseEntity.ok(response);
    }
}
