package com.example.hiveptit.model;
import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "users")
public class Users {
    @Id
    @Column(name = "student_id", length = 10)
    private String studentId;

    @Column(name = "password_hash", nullable = false, length = 300)
    private String passwordHash;

    @Column(name = "username", nullable = false, unique = true, length = 30)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 30)
    private String email;

    @Column(name = "firstname", length = 30)
    private String firstname;

    @Column(name = "lastname", length = 30)
    private String lastname;

    @Column(name = "avatar_url", length = 50)
    private String avatarUrl;

    @Lob
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_verified", columnDefinition = "ENUM('Y','N') default 'N'")
    private VerifyStatus isVerified = VerifyStatus.N;

    @Column(name = "ranking_core", nullable = false)
    private int rankingCore = 0;

    // Quan hệ với Role
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Roles> roles = new HashSet<>();

    // Quan hệ với Topic
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_topic",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "topic_id")
    )
    private Set<Topics> topics = new HashSet<>();

    // 1 User - n BookmarkList
    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bookmark_List> bookmarkLists = new ArrayList<>();

    // 1 User - n Post
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Posts> posts = new ArrayList<>();

    // 1 User - n Comment
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comments> comments = new ArrayList<>();

    // Quan hệ Follow
    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Follows> following = new HashSet<>();

    @OneToMany(mappedBy = "following", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Follows> followers = new HashSet<>();

    public enum VerifyStatus { Y, N }
}
