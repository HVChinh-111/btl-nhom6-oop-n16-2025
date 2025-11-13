package com.example.hiveptit.controller;

import com.example.hiveptit.dto.*;
import com.example.hiveptit.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }
    // Lấy danh sách bình luận của 1 bài viết (parent = null)
    // GET /api/posts/{postId}/comments?depth=0&page=0&size=10&sortBy=createdAt&direction=asc
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<PagedResponse<CommentResponse>> listByPost(
            @PathVariable Integer postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "0") int depth
    ) {
        return ResponseEntity.ok(
                commentService.listForPost(postId, page, size, sortBy, direction, depth)
        );
    }
    // Lấy ra chi tiết của bình luận
    // GET /api/comments/{id}?depth=1
    @GetMapping("/comments/{id}")
    public ResponseEntity<CommentResponse> getOne(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "1") int depth
    ) {
        return ResponseEntity.ok(commentService.getComment(id, depth));
    }

    //tạo comment mới
    // POST /api/posts/{postId}/comments
    @PostMapping(path = "/posts/{postId}/comments", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> create(
            @PathVariable Integer postId,
            @Valid @RequestBody CommentCreateRequest request,
            Principal principal
    ) {
        CommentResponse response = commentService.create(postId, principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // sửa comment
    // PUT /api/comments/{id}
    @PutMapping(path = "/comments/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody CommentUpdateRequest request,
            Principal principal
    ) {
        boolean isAdmin = hasAdminRole();
        CommentResponse response = commentService.update(id, principal.getName(), request, isAdmin);
        return ResponseEntity.ok(response);
    }

    // xóa comment
    // DELETE /api/comments/{id}
    @DeleteMapping("/comments/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id,
            Principal principal
    ) {
        boolean isAdmin = hasAdminRole();
        commentService.delete(id, principal.getName(), isAdmin);
        return ResponseEntity.noContent().build();
    }

    // Tùy cơ chế security thực tế; có thể thay bằng @PreAuthorize và kiểm tra trong service
    private boolean hasAdminRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            String role = authority.getAuthority();
            if ("ROLE_ADMIN".equals(role) || "ADMIN".equals(role)) {
                return true;
            }
        }
        return false;
    }

}