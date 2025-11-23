package com.example.hiveptit.controller;

import com.example.hiveptit.dto.LeaderboardUserResponse;
import com.example.hiveptit.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/top100")
    public ResponseEntity<List<LeaderboardUserResponse>> getTop100() {
        List<LeaderboardUserResponse> leaderboard = leaderboardService.getTop100Users();
        return ResponseEntity.ok(leaderboard);
    }

    /**
     * Get paginated leaderboard
     * @param page Page number (0-based)
     * @param size Number of items per page (default: 10)
     * @return Paginated leaderboard with metadata
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<LeaderboardUserResponse> leaderboardPage = leaderboardService.getLeaderboard(page, size);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", leaderboardPage.getContent());
        response.put("currentPage", leaderboardPage.getNumber());
        response.put("totalItems", leaderboardPage.getTotalElements());
        response.put("totalPages", leaderboardPage.getTotalPages());
        response.put("pageSize", leaderboardPage.getSize());
        response.put("hasNext", leaderboardPage.hasNext());
        response.put("hasPrevious", leaderboardPage.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
}
