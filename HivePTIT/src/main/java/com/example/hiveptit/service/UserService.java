package com.example.hiveptit.service;

import com.example.hiveptit.dto.UpdateProfileRequest;
import com.example.hiveptit.dto.UserProfileResponse;
import com.example.hiveptit.model.Follows;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.FollowRepository;
import com.example.hiveptit.repository.PostRepository;
import com.example.hiveptit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FollowRepository followRepository;

    public UserProfileResponse getUserProfile(String username, String currentUsername) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        UserProfileResponse response = new UserProfileResponse();
        response.setStudentId(user.getStudentId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstname(user.getFirstname());
        response.setLastname(user.getLastname());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setBio(user.getBio());
        response.setRankingCore(user.getRankingCore());

        response.setPostCount(postRepository.countByAuthor(user));
        response.setFollowerCount(followRepository.countFollowers(user));
        response.setFollowingCount(followRepository.countFollowing(user));

        if (currentUsername != null && !currentUsername.equals(username)) {
            Users currentUser = userRepository.findByUsername(currentUsername).orElse(null);
            if (currentUser != null) {
                boolean isFollowing = followRepository.existsByFollowerAndFollowing(currentUser, user);
                response.setIsFollowing(isFollowing);
            } else {
                response.setIsFollowing(false);
            }
        } else {
            response.setIsFollowing(null);
        }

        return response;
    }

    @Transactional
    public UserProfileResponse updateProfile(String username, UpdateProfileRequest request) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (request.getFirstname() != null) {
            user.setFirstname(request.getFirstname());
        }
        if (request.getLastname() != null) {
            user.setLastname(request.getLastname());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        userRepository.save(user);

        return getUserProfile(username, username);
    }
}
