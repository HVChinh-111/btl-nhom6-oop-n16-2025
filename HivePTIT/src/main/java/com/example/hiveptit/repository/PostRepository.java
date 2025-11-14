package com.example.hiveptit.repository;

import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Topics;
import com.example.hiveptit.model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Posts, Integer> {
    Optional<Posts> findById(Integer Id);

    Long countByAuthor(Users user);

    Page<Posts> findByAuthorStudentIdIn(List<String> studentIds, Pageable pageable);

    List<Posts> findByCreatedAtAfter(Instant createdAt);

    Page<Posts> findByTopicsContaining(Topics topic, Pageable pageable);
}
