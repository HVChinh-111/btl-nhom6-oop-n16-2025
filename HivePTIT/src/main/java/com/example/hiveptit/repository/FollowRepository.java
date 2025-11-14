package com.example.hiveptit.repository;

import com.example.hiveptit.model.Follows;
import com.example.hiveptit.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follows, Follows.FollowsId> {
    
    Optional<Follows> findByFollowerAndFollowing(Users follower, Users following);
    
    List<Follows> findByFollower(Users follower);
    
    List<Follows> findByFollowing(Users following);
    
    @Query("SELECT COUNT(f) FROM Follows f WHERE f.following = :user")
    long countFollowers(@Param("user") Users user);
    
    @Query("SELECT COUNT(f) FROM Follows f WHERE f.follower = :user")
    long countFollowing(@Param("user") Users user);
    
    Long countByFollowing(Users user);
    
    boolean existsByFollowerAndFollowing(Users follower, Users following);

    @Query("SELECT f.following.studentId FROM Follows f WHERE f.follower.studentId = :followerId")
    List<String> findFollowingIdsByFollowerId(@Param("followerId") String followerId);
}
