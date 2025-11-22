package com.example.hiveptit.service;

import com.example.hiveptit.dto.LeaderboardUserResponse;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.FollowRepository;
import com.example.hiveptit.repository.PostRepository;
import com.example.hiveptit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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

    /**
     * Get paginated leaderboard with global ranking
     * @param page Page number (0-based)
     * @param size Number of items per page
     * @return Page of LeaderboardUserResponse with correct global ranking
     */
    public Page<LeaderboardUserResponse> getLeaderboard(int page, int size) {
        // Fetch all users sorted by rankingCore to calculate global rank
        List<Users> allUsersSorted = userRepository.findAll(Sort.by("rankingCore").descending());
        
        // Get total count
        long totalUsers = allUsersSorted.size();
        
        // Calculate pagination boundaries
        int start = page * size;
        int end = Math.min(start + size, allUsersSorted.size());
        
        // Get users for current page
        List<Users> pageUsers = allUsersSorted.subList(start, end);
        
        // Map to response DTOs with global ranking
        List<LeaderboardUserResponse> responses = pageUsers.stream()
                .map(user -> {
                    Long postCount = postRepository.countByAuthor(user);
                    Long followerCount = followRepository.countByFollowing(user);
                    
                    // Calculate global rank (position in full sorted list + 1)
                    int globalRank = allUsersSorted.indexOf(user) + 1;
                    
                    return new LeaderboardUserResponse(
                            globalRank,
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
        
        // Create pageable
        Pageable pageable = PageRequest.of(page, size);
        
        // Return as Page
        return new PageImpl<>(responses, pageable, totalUsers);
    }
}
