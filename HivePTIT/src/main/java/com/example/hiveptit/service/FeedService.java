package com.example.hiveptit.service;

import com.example.hiveptit.dto.FeedPostResponse;
import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Topics;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.FollowRepository;
import com.example.hiveptit.repository.PostRepository;
import com.example.hiveptit.repository.TopicRepository;
import com.example.hiveptit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private TopicRepository topicRepository;

    public List<FeedPostResponse> getFollowingFeed(String username, int page, int size) {
        Users currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> followingIds = followRepository.findFollowingIdsByFollowerId(currentUser.getStudentId());

        if (followingIds.isEmpty()) {
            return new ArrayList<>();
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Posts> postsPage = postRepository.findByAuthorStudentIdIn(followingIds, pageable);

        return postsPage.getContent().stream()
                .map(this::convertToFeedPostResponse)
                .collect(Collectors.toList());
    }

    public List<FeedPostResponse> getTrendingFeed() {
        Instant twentyFourHoursAgo = Instant.now().minus(24, ChronoUnit.HOURS);

        List<Posts> recentPosts = postRepository.findByCreatedAtAfter(twentyFourHoursAgo);

        List<FeedPostResponse> feedPosts = recentPosts.stream()
                .map(post -> {
                    FeedPostResponse response = convertToFeedPostResponse(post);
                    double score = calculateTrendingScore(post);
                    response.setTrendingScore(score);
                    return response;
                })
                .sorted(Comparator.comparing(FeedPostResponse::getTrendingScore).reversed())
                .limit(10)
                .collect(Collectors.toList());

        return feedPosts;
    }

    public List<FeedPostResponse> getHomeFeed(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Posts> postsPage = postRepository.findAll(pageable);

        return postsPage.getContent().stream()
                .map(this::convertToFeedPostResponse)
                .collect(Collectors.toList());
    }

    public List<FeedPostResponse> getTopicFeed(String topicName, int page, int size) {
        Topics topic = topicRepository.findByNameIgnoreCase(topicName)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + topicName));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Posts> postsPage = postRepository.findByTopicsContaining(topic, pageable);

        return postsPage.getContent().stream()
                .map(this::convertToFeedPostResponse)
                .collect(Collectors.toList());
    }

    private double calculateTrendingScore(Posts post) {
        int upvotes = post.getVoteCount() > 0 ? post.getVoteCount() : 0;
        int downvotes = post.getVoteCount() < 0 ? Math.abs(post.getVoteCount()) : 0;
        int commentCount = post.getComments() != null ? post.getComments().size() : 0;

        return (upvotes - downvotes) + (commentCount * 2.0);
    }

    private FeedPostResponse convertToFeedPostResponse(Posts post) {
        FeedPostResponse response = new FeedPostResponse();
        
        response.setPostId(post.getPostId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setVoteCount(post.getVoteCount());
        
        LocalDateTime createdAt = LocalDateTime.ofInstant(post.getCreatedAt(), ZoneId.systemDefault());
        LocalDateTime updatedAt = LocalDateTime.ofInstant(post.getUpdatedAt(), ZoneId.systemDefault());
        response.setCreatedAt(createdAt);
        response.setUpdatedAt(updatedAt);
        
        Users author = post.getAuthor();
        response.setAuthorUsername(author.getUsername());
        response.setAuthorFirstname(author.getFirstname());
        response.setAuthorLastname(author.getLastname());
        response.setAuthorAvatarUrl(author.getAvatarUrl());
        
        List<String> topicNames = post.getTopics().stream()
                .map(Topics::getName)
                .collect(Collectors.toList());
        response.setTopics(topicNames);
        
        Integer commentCount = post.getComments() != null ? post.getComments().size() : 0;
        response.setCommentCount(commentCount);
        
        return response;
    }
}
