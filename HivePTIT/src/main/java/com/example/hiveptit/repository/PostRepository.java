package com.example.hiveptit.repository;

import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Topics;
import com.example.hiveptit.model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Posts, Integer> {
    Optional<Posts> findById(Integer Id);

    Long countByAuthor(Users user);

    Page<Posts> findByAuthorStudentIdIn(List<String> studentIds, Pageable pageable);

    List<Posts> findByCreatedAtAfter(Instant createdAt);

    Page<Posts> findByAuthor(Users author, Pageable pageable);

    @Query(
            value = """
                SELECT p.*
                FROM posts p
                WHERE MATCH(p.title, p.content) AGAINST (:keyword IN BOOLEAN MODE)
                ORDER BY p.created_at DESC
                """,
            countQuery = """
                SELECT COUNT(*)
                FROM posts p
                WHERE MATCH(p.title, p.content) AGAINST (:keyword IN BOOLEAN MODE)
                """,
            nativeQuery = true
    )
    Page<Posts> searchFullText(@Param("keyword") String keyword, Pageable pageable);

}
