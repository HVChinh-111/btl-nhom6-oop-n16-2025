package com.example.hiveptit.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CommentResponse(
        Integer id,
        Integer postId,
        UserSummaryDTO author,
        String content,
        int voteCount,
        String isEdited, // "Y" | "N"
        LocalDateTime createdAt,
        Integer parentCommentId,
        List<CommentResponse> replies
) {}