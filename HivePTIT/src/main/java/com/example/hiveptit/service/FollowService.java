package com.example.hiveptit.service;

import com.example.hiveptit.dto.FollowResponse;
import com.example.hiveptit.dto.UserSummaryDTO;
import com.example.hiveptit.model.Follows;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.FollowRepository;
import com.example.hiveptit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public FollowResponse toggleFollow(String currentUsername, String targetUsername) {
        if (currentUsername.equals(targetUsername)) {
            return new FollowResponse("Cannot follow yourself", false, "ERROR", null, null);
        }

        Users currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        Users targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        boolean exists = followRepository.existsByFollowerAndFollowing(currentUser, targetUser);

        String action;
        String message;

        if (exists) {
            Follows follow = followRepository.findByFollowerAndFollowing(currentUser, targetUser)
                    .orElseThrow(() -> new RuntimeException("Follow relationship not found"));
            followRepository.delete(follow);
            action = "UNFOLLOWED";
            message = "Unfollowed " + targetUsername + " successfully";
        } else {
            Follows newFollow = new Follows(currentUser, targetUser);
            followRepository.save(newFollow);
            action = "FOLLOWED";
            message = "Followed " + targetUsername + " successfully";
        }

        int followerCount = followRepository.countFollowers(targetUser);
        int followingCount = followRepository.countFollowing(targetUser);

        return new FollowResponse(message, true, action, followerCount, followingCount);
    }

    public List<UserSummaryDTO> getFollowers(String username, String currentUsername) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Users currentUser = null;
        if (currentUsername != null) {
            currentUser = userRepository.findByUsername(currentUsername).orElse(null);
        }

        List<Follows> follows = followRepository.findByFollowing(user);

        Users finalCurrentUser = currentUser;
        return follows.stream()
                .map(follow -> {
                    Users follower = follow.getFollower();
                    boolean isFollowing = finalCurrentUser != null &&
                            followRepository.existsByFollowerAndFollowing(finalCurrentUser, follower);

                    return new UserSummaryDTO(
                            follower.getStudentId(),
                            follower.getUsername(),
                            follower.getFirstname(),
                            follower.getLastname(),
                            follower.getAvatarUrl(),
                            follower.getBio(),
                            follower.getRankingCore(),
                            isFollowing
                    );
                })
                .collect(Collectors.toList());
    }

    public List<UserSummaryDTO> getFollowing(String username, String currentUsername) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Users currentUser = null;
        if (currentUsername != null) {
            currentUser = userRepository.findByUsername(currentUsername).orElse(null);
        }

        List<Follows> follows = followRepository.findByFollower(user);

        Users finalCurrentUser = currentUser;
        return follows.stream()
                .map(follow -> {
                    Users following = follow.getFollowing();
                    boolean isFollowing = finalCurrentUser != null &&
                            followRepository.existsByFollowerAndFollowing(finalCurrentUser, following);

                    return new UserSummaryDTO(
                            following.getStudentId(),
                            following.getUsername(),
                            following.getFirstname(),
                            following.getLastname(),
                            following.getAvatarUrl(),
                            following.getBio(),
                            following.getRankingCore(),
                            isFollowing
                    );
                })
                .collect(Collectors.toList());
    }

    public int getFollowerCount(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return followRepository.countFollowers(user);
    }

    public int getFollowingCount(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return followRepository.countFollowing(user);
    }

    public boolean isFollowing(String followerUsername, String followingUsername) {
        Users follower = userRepository.findByUsername(followerUsername).orElse(null);
        Users following = userRepository.findByUsername(followingUsername).orElse(null);

        if (follower == null || following == null) {
            return false;
        }

        return followRepository.existsByFollowerAndFollowing(follower, following);
    }
}
