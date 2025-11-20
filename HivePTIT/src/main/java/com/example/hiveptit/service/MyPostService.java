package com.example.hiveptit.service;

import com.example.hiveptit.dto.PagedResponse;
import com.example.hiveptit.dto.PostResponse;
import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.PostRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
// lấy ra bài post của mình
@Service
public class MyPostService {

    private final PostRepository postRepository;
    private final CurrentUserService currentUserService;

    public MyPostService(PostRepository postRepository, CurrentUserService currentUserService) {
        this.postRepository = postRepository;
        this.currentUserService = currentUserService;
    }

    public PagedResponse<PostResponse> getMyPosts(int page, int size, String sort) {
        Sort sortSpec = parseSort(sort, Sort.by(Sort.Direction.DESC, "createdAt"));
        Pageable pageable = PageRequest.of(page, size, sortSpec);

        Users me = currentUserService.getCurrentUserOrThrow();
        Page<Posts> postPage = postRepository.findByAuthor(me, pageable);

        List<PostResponse> content = postPage.getContent().stream()
                .map(p -> mapToPostResponse(p, me))
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                postPage.getNumber(),
                postPage.getSize(),
                postPage.getTotalElements(),
                postPage.getTotalPages(),
                postPage.isLast()
        );
    }

    private Sort parseSort(String sort, Sort defaultSort) {
        if (sort == null || sort.isBlank()) return defaultSort;
        try {
            String[] parts = sort.split(",");
            String prop = parts[0].trim();
            Sort.Direction dir = parts.length > 1 ? Sort.Direction.fromString(parts[1].trim()) : Sort.Direction.ASC;
            return Sort.by(dir, prop);
        } catch (Exception e) {
            return defaultSort;
        }
    }

    private PostResponse mapToPostResponse(Posts p, Users currentUser) {
        PostResponse dto = new PostResponse();
        dto.setId(p.getPostId());
        dto.setTitle(p.getTitle());
        dto.setContent(p.getContent());
        dto.setVoteCount(p.getVoteCount());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());
        // Nếu PostResponse có thông tin author, topics... thì map thêm tại đây
        return dto;
    }
}