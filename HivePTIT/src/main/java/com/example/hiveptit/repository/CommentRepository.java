package com.example.hiveptit.repository;

import com.example.hiveptit.model.Comments;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comments, Integer> {
    Page<Comments> findByPost_PostIdAndParentCommentIsNull(Integer postId, Pageable pageable);
    List<Comments> findByParentComment_CommentIdIn(List<Integer> parentIds);
    List<Comments> findByParentComment_CommentId(Integer parentId);
    Optional<Comments> findByCommentIdAndPost_PostId(Integer id, Integer postId);
}