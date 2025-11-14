package com.example.hiveptit.controller;

import com.example.hiveptit.dto.LeaderboardUserResponse;
import com.example.hiveptit.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
