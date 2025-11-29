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
import java.util.stream.Collectors;

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


    public Page<PostResponse> searchPosts(String q, Pageable pageable, String currentUsername) {
        if (q == null || q.isBlank()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }

        // Tách các từ khóa
        String[] words = q.trim().split("\\s+");
        String keyword = q.trim();
        String likeKeyword = q.trim();

        // Lấy tất cả kết quả từ database
        Page<Posts> postsPage = postRepository.searchFullText(keyword, likeKeyword, pageable);

        // Filter: phải chứa TẤT CẢ từ khóa (logic AND)
        List<Posts> filtered = postsPage.getContent().stream()
                .filter(post -> {
                    String searchText = (post.getTitle() + " " + post.getContent()).toLowerCase();
                    return java.util.Arrays.stream(words)
                            .allMatch(word -> searchText.contains(word.toLowerCase()));
                })
                .collect(Collectors.toList());

        // Map to response
        List<PostResponse> responses = filtered.stream()
                .map(post -> {
                    PostResponse dto = new PostResponse();
                    dto.setId(post.getPostId());
                    dto.setTitle(post.getTitle());
                    dto.setContent(post.getContent());
                    dto.setCreatedAt(post.getCreatedAt());
                    dto.setUpdatedAt(post.getUpdatedAt());

                    if (post.getAuthor() != null) {
                        Users author = post.getAuthor();
                        boolean isFollowing = false;
                        if (currentUsername != null && !currentUsername.isBlank()
                                && !currentUsername.equals(author.getUsername())) {
                            isFollowing = followService.isFollowing(currentUsername, author.getUsername());
                        }

                        UserSummaryDTO authorDTO = new UserSummaryDTO(
                                author.getStudentId(),
                                author.getUsername(),
                                author.getFirstname(),
                                author.getLastname(),
                                author.getAvatarUrl(),
                                author.getBio(),
                                author.getRankingCore(),
                                isFollowing
                        );
                        dto.setAuthor(authorDTO);
                    }

                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, filtered.size());
    }




    public Page<UserSummaryDTO> searchUsers(String q, Pageable pageable, String currentUsername) {
        if (q == null || q.isBlank()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }

        String keyword = q.trim() + "*";
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