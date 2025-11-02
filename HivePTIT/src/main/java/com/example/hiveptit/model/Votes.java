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
}
