package com.example.hiveptit.service;

import com.example.hiveptit.dto.PagedResponse;
import com.example.hiveptit.dto.PostResponse;
import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.BookmarkListRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// lấy ra bookmark của mình
@Service
public class MyBookmarkQueryService {

    private final BookmarkListRepository bookmarkListRepository;
    private final CurrentUserService currentUserService;

    public MyBookmarkQueryService(BookmarkListRepository bookmarkListRepository,
                                  CurrentUserService currentUserService) {
        this.bookmarkListRepository = bookmarkListRepository;
        this.currentUserService = currentUserService;
    }

    public PagedResponse<PostResponse> getMyBookmarkedPosts(int page, int size, String sort) {
        Sort sortSpec = parseSort(sort, Sort.by(Sort.Direction.DESC, "createdAt"));
        Pageable pageable = PageRequest.of(page, size, sortSpec);

        Users me = currentUserService.getCurrentUserOrThrow();

        // Dùng query trả về thẳng Posts để tránh vòng lặp map Bookmark_List -> Post
        Page<Posts> postPage = bookmarkListRepository.findBookmarkedPostsByUsers(me, pageable);

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
        return dto;
    }
}