package com.example.hiveptit.model;
import jakarta.persistence.*;

@Entity
@Table(name = "votes",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"student_id", "post_id"}),
                @UniqueConstraint(columnNames = {"student_id", "comment_id"})
        })
public class Votes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer voteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Users voter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Posts post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comments comment;

    @Enumerated(EnumType.STRING)
    @Column(name = "vote_type", columnDefinition = "ENUM('upvote','downvote')")
    private VoteType voteType;

    public enum VoteType { upvote, downvote }

    public Votes() {
    }

    public Votes(Users voter, Posts post, Comments comment, VoteType voteType) {
        this.voter = voter;
        this.post = post;
        this.comment = comment;
        this.voteType = voteType;
    }

    public Integer getVoteId() {
        return voteId;
    }

    public void setVoteId(Integer voteId) {
        this.voteId = voteId;
    }

    public Users getVoter() {
        return voter;
    }

    public void setVoter(Users voter) {
        this.voter = voter;
    }

    public Posts getPost() {
        return post;
    }

    public void setPost(Posts post) {
        this.post = post;
    }

    public Comments getComment() {
        return comment;
    }

    public void setComment(Comments comment) {
        this.comment = comment;
    }

    public VoteType getVoteType() {
        return voteType;
    }

    public void setVoteType(VoteType voteType) {
        this.voteType = voteType;
    }
}
