package com.example.hiveptit.service;

import com.example.hiveptit.dto.LeaderboardUserResponse;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.FollowRepository;
import com.example.hiveptit.repository.PostRepository;
import com.example.hiveptit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FollowRepository followRepository;

    public List<LeaderboardUserResponse> getTop100Users() {
        Pageable pageable = PageRequest.of(0, 100, Sort.by("rankingCore").descending());
        List<Users> topUsers = userRepository.findAll(pageable).getContent();

        return topUsers.stream()
                .map(user -> {
                    Long postCount = postRepository.countByAuthor(user);
                    Long followerCount = followRepository.countByFollowing(user);
                    
                    int userRank = topUsers.indexOf(user) + 1;
                    
                    return new LeaderboardUserResponse(
                            userRank,
                            user.getStudentId(),
                            user.getUsername(),
                            user.getFirstname(),
                            user.getLastname(),
                            user.getAvatarUrl(),
                            user.getRankingCore(),
                            postCount,
                            followerCount
                    );
                })
                .collect(Collectors.toList());
    }
}
