package com.example.hiveptit.model;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "comments")
public class Comments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Integer commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Posts post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Users author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comments parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comments> replies = new ArrayList<>();

    @Column(name = "vote_count", nullable = false)
    private int voteCount = 0;

//    @Lob
    private String content;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "is_edited", columnDefinition = "ENUM('Y','N') default 'N'")
    private EditedStatus isEdited = EditedStatus.N;

    public enum EditedStatus { Y, N }
    public Comments() {}
    public Comments(Integer commentId, Posts post, Users author, Comments parentComment, List<Comments> replies, int voteCount, String content, Instant createdAt, EditedStatus isEdited) {
        this.commentId = commentId;
        this.post = post;
        this.author = author;
        this.parentComment = parentComment;
        this.replies = replies;
        this.voteCount = voteCount;
        this.content = content;
        this.createdAt = createdAt;
        this.isEdited = isEdited;
    }

    public EditedStatus getIsEdited() {
        return isEdited;
    }

    public void setIsEdited(EditedStatus isEdited) {
        this.isEdited = isEdited;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(int voteCount) {
        this.voteCount = voteCount;
    }

    public List<Comments> getReplies() {
        return replies;
    }

    public void setReplies(List<Comments> replies) {
        this.replies = replies;
    }

    public Comments getParentComment() {
        return parentComment;
    }

    public void setParentComment(Comments parentComment) {
        this.parentComment = parentComment;
    }

    public Users getAuthor() {
        return author;
    }

    public void setAuthor(Users author) {
        this.author = author;
    }

    public Posts getPost() {
        return post;
    }

    public void setPost(Posts post) {
        this.post = post;
    }

    public Integer getCommentId() {
        return commentId;
    }

    public void setCommentId(Integer commentId) {
        this.commentId = commentId;
    }
}
