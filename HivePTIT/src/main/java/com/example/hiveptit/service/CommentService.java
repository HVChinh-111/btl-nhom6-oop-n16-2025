package com.example.hiveptit.service;

import com.example.hiveptit.dto.*;
import com.example.hiveptit.model.Comments;
import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.CommentRepository;
import com.example.hiveptit.repository.PostRepository;
import com.example.hiveptit.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository,
                          PostRepository postRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CommentResponse create(Integer postId, String currentUsername, CommentCreateRequest request) {
        Posts post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        Users author = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Comments parent = null;
        if (request.parentCommentId() != null) {
            parent = commentRepository.findById(request.parentCommentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent comment not found"));
            if (!Objects.equals(parent.getPost().getPostId(), postId)) {
                throw new IllegalArgumentException("Parent comment does not belong to this post");
            }
        }

        Comments c = new Comments();
        c.setPost(post);
        c.setAuthor(author);
        c.setParentComment(parent);
        c.setContent(request.content());
        c.setCreatedAt(Instant.now());
        c.setIsEdited(Comments.EditedStatus.N);
        c = commentRepository.save(c);

        return toResponse(c, 0);
    }


    @Transactional
    public PagedResponse<CommentResponse> listForPost(Integer postId, int page, int size, String sortBy, String direction, int depth) {
        Sort sort = Sort.by("createdAt");
        if ("voteCount".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("voteCount").and(Sort.by("createdAt"));
        }
        sort = "desc".equalsIgnoreCase(direction) ? sort.descending() : sort.ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Comments> topLevel = commentRepository.findByPost_PostIdAndParentCommentIsNull(postId, pageable);

        List<CommentResponse> content = topLevel.getContent().stream()
                .map(c -> toResponse(c, depth))
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                topLevel.getNumber(),
                topLevel.getSize(),
                topLevel.getTotalElements(),
                topLevel.getTotalPages(),
                topLevel.isLast()
        );
    }

    @Transactional
    public CommentResponse getComment(Integer commentId, int depth) {
        Comments c = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));
        return toResponse(c, depth);
    }

    @Transactional
    public CommentResponse update(Integer commentId, String currentUsername, CommentUpdateRequest request, boolean isAdmin) {
        Comments c = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        boolean isOwner = c.getAuthor() != null && Objects.equals(c.getAuthor().getUsername(), currentUsername);
        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("Not allowed to edit this comment");
        }
        c.setContent(request.content());
        c.setIsEdited(Comments.EditedStatus.Y);
        c = commentRepository.save(c);
        return toResponse(c, 0);
    }

    @Transactional
    public void delete(Integer commentId, String currentUsername, boolean isAdmin) {
        Comments c = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        boolean isOwner = c.getAuthor() != null && Objects.equals(c.getAuthor().getUsername(), currentUsername);
        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("Not allowed to delete this comment");
        }
        else commentRepository.delete(c);
    }

    private CommentResponse toResponse(Comments c, int depthRemaining) {
        List<CommentResponse> replies = List.of();
        if (depthRemaining > 0) {
            replies = c.getReplies().stream()
                    .sorted(Comparator.comparing(Comments::getCreatedAt))
                    .map(r -> toResponse(r, depthRemaining - 1))
                    .collect(Collectors.toList());
        }
        return new CommentResponse(
                c.getCommentId(),
                c.getPost() != null ? c.getPost().getPostId() : null,
                c.getAuthor() == null ? null : new CommentAuthorDto(
                        c.getAuthor().getStudentId(),
                        c.getAuthor().getUsername(),
                        c.getAuthor().getFirstname(),
                        c.getAuthor().getLastname(),
                        c.getAuthor().getAvatarUrl()
                ),
                c.getContent(),
                c.getVoteCount(),
                c.getIsEdited() != null ? c.getIsEdited().name() : "N",
                c.getCreatedAt(),
                c.getParentComment() != null ? c.getParentComment().getCommentId() : null,
                replies
        );
    }
}