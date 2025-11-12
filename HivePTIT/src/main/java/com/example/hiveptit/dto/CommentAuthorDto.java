package com.example.hiveptit.dto;

public record CommentAuthorDto(
        String studentId,
        String username,
        String firstName,
        String lastName,
        String avatarUrl
) {}