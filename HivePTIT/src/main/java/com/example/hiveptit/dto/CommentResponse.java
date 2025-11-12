package com.example.hiveptit.dto;

import java.time.Instant;
import java.util.List;

public record CommentResponse(
        Integer id,
        Integer postId,
        CommentAuthorDto author,
        String content,
        int voteCount,
        String isEdited, // "Y" | "N"
        Instant createdAt,
        Integer parentCommentId,
        List<CommentResponse> replies
) {}