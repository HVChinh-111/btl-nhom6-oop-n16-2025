package com.example.hiveptit.controller;

import com.example.hiveptit.dto.VoteRequest;
import com.example.hiveptit.dto.VoteResponse;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    @Autowired
    private VoteService voteService;

    @PostMapping("/post")
    public ResponseEntity<VoteResponse> votePost(
            @RequestBody VoteRequest request,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        VoteResponse response = voteService.votePost(request, username);
        return ResponseEntity.ok(response);
    }
}
