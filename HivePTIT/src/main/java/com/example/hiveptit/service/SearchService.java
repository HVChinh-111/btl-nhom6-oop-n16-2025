package com.example.hiveptit.service;

import com.example.hiveptit.dto.PostResponse;
import com.example.hiveptit.dto.UserSummaryDTO;
import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.PostRepository;
import com.example.hiveptit.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class SearchService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FollowService followService;



    public SearchService(PostRepository postRepository, UserRepository userRepository,FollowService followService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.followService = followService;
    }

    public Page<PostResponse> searchPosts(String q, Pageable pageable) {
        if (q == null || q.isBlank()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }

        String keyword = q.trim() + "*";  // e.g. "abc*"
        Page<Posts> posts = postRepository.searchFullText(keyword, pageable);
        return posts.map(post -> {
            PostResponse dto = new PostResponse();
            dto.setId(post.getPostId());
            dto.setTitle(post.getTitle());
            dto.setContent(post.getContent());
            dto.setCreatedAt(post.getCreatedAt());
            dto.setUpdatedAt(post.getUpdatedAt());
            return dto;
        });
    }



    public Page<UserSummaryDTO> searchUsers(String q, Pageable pageable, String currentUsername) {
        if (q == null || q.isBlank()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }

        String keyword = q.trim() + "*";  // e.g. "abc*"
        Page<Users> users = userRepository.searchFullText(keyword, pageable);

        List<UserSummaryDTO> content = new ArrayList<>();
        for (Users u : users.getContent()) {
            boolean isFollowing = false;
            if (currentUsername != null && !currentUsername.isBlank()
                    && !currentUsername.equals(u.getUsername())) {
                isFollowing = followService.isFollowing(currentUsername, u.getUsername());
            }

            UserSummaryDTO dto = new UserSummaryDTO(
                    u.getStudentId(),
                    u.getUsername(),
                    u.getFirstname(),
                    u.getLastname(),
                    u.getAvatarUrl(),
                    u.getBio(),
                    u.getRankingCore(),
                    isFollowing
            );
            content.add(dto);
        }

        return new PageImpl<>(content, pageable, users.getTotalElements());
    }

}