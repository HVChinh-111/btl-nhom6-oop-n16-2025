package com.example.hiveptit.controller;

import com.example.hiveptit.dto.PostRequest;
import com.example.hiveptit.dto.PostResponse;
import com.example.hiveptit.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // POST /api/posts : Tạo bài viết mới
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestBody PostRequest request,
            Principal principal
    ) {
        PostResponse response = postService.createPost(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PUT /api/posts/{id} : Sửa bài viết (chỉ chủ bài viết)
    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Integer id,
            @Valid @RequestBody PostRequest request,
            Principal principal
    ) {
        PostResponse response = postService.updatePost(id, request, principal.getName());
        return ResponseEntity.ok(response);
    }

    // admin hoặc người tạo
    // DELETE /api/posts/{id} : Xóa cứng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Integer id,
            Principal principal
    ) {
        postService.hardDeletePost(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    // GET /api/posts/{id} : Xem chi tiết bài viết
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Integer id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

}