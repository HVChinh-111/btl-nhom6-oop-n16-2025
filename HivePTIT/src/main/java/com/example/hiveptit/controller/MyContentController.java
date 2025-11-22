package com.example.hiveptit.controller;

import com.example.hiveptit.dto.PagedResponse;
import com.example.hiveptit.dto.PostResponse;
import com.example.hiveptit.service.MyBookmarkQueryService;
import com.example.hiveptit.service.MyPostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
public class MyContentController {

    private final MyPostService myPostService;
    private final MyBookmarkQueryService myBookmarkQueryService;

    public MyContentController(MyPostService myPostService,
                               MyBookmarkQueryService myBookmarkQueryService) {
        this.myPostService = myPostService;
        this.myBookmarkQueryService = myBookmarkQueryService;
    }

    // GET /api/users/me/posts?page=0&size=10&sort=createdAt,desc
    @GetMapping("/posts")
    public ResponseEntity<PagedResponse<PostResponse>> getMyPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sort
    ) {
        return ResponseEntity.ok(myPostService.getMyPosts(page, size, sort));
    }

    // GET /api/users/me/bookmarks?page=0&size=10&sort=createdAt,desc
    @GetMapping("/bookmarks")
    public ResponseEntity<PagedResponse<PostResponse>> getMyBookmarkedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sort
    ) {
        return ResponseEntity.ok(myBookmarkQueryService.getMyBookmarkedPosts(page, size, sort));
    }
}