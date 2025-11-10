package com.example.hiveptit.dto;

public class VoteRequest {
    private Integer postId;
    private Integer commentId;
    private String voteType;

    public VoteRequest() {
    }

    public VoteRequest(Integer postId, Integer commentId, String voteType) {
        this.postId = postId;
        this.commentId = commentId;
        this.voteType = voteType;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    public Integer getCommentId() {
        return commentId;
    }

    public void setCommentId(Integer commentId) {
        this.commentId = commentId;
    }

    public String getVoteType() {
        return voteType;
    }

    public void setVoteType(String voteType) {
        this.voteType = voteType;
    }
}
