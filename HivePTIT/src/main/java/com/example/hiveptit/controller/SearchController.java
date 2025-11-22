package com.example.hiveptit.controller;

import com.example.hiveptit.dto.PostResponse;
import com.example.hiveptit.dto.UserSummaryDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import com.example.hiveptit.service.SearchService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }
//   GET /api/search/posts?q=keyword
    @GetMapping("/posts")
    public Page<PostResponse> searchPosts(
            @RequestParam("q") String q,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return searchService.searchPosts(q, pageable);
    }

//    GET /api/search/users?q=keyword
    @GetMapping("/users")
    public Page<UserSummaryDTO> searchUsers(
            @RequestParam("q") String q,
            @PageableDefault(size = 10, sort = "student_id") Pageable pageable,
            Authentication authentication
    ) {
        String currentUsername = null;
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            currentUsername = userDetails.getUsername();
        }

        return searchService.searchUsers(q, pageable, currentUsername);


    }
}