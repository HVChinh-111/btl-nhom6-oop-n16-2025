package com.example.hiveptit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentCreateRequest(
        @NotBlank @Size(max = 10_000) String content,
        Integer parentCommentId // null => bình luận gốc
) {}