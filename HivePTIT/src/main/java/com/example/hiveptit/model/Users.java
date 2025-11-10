package com.example.hiveptit.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class Users {

    @Id
    @Column(name = "student_id", columnDefinition = "CHAR(10)", nullable = false)
    private String studentId;

    @Column(name = "password_hash", columnDefinition = "VARCHAR(255)", nullable = false)
    private String passwordHash;

    @Column(name = "username", length = 30, nullable = false, unique = true)
    private String username;

    @Column(name = "email", length = 50, nullable = false, unique = true)
    private String email;

    @Column(name = "firstname", length = 30)
    private String firstname;

    @Column(name = "lastname", length = 30)
    private String lastname;

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_verified", length = 1, nullable = false)
    private IsVerified isVerified = IsVerified.N;

    @Column(name = "ranking_core", nullable = false)
    private Integer rankingCore = 0;

    // Quan hệ Many-to-Many với Roles thông qua bảng user_role
    @ManyToMany(fetch = FetchType.EAGER) // EAGER: load roles cùng với user
    @JoinTable(
        name = "user_role",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Roles> roles = new HashSet<>();

    // Quan hệ Many-to-Many với Topics thông qua bảng user_topic
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_topic",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "topic_id")
    )
    private Set<Topics> topics = new HashSet<>();

    public enum IsVerified {
        Y, N
    }

    public Users() {
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public IsVerified getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(IsVerified isVerified) {
        this.isVerified = isVerified;
    }

    public void setRankingCore(Integer rankingCore) {
        this.rankingCore = rankingCore;
    }

    public Integer getRankingCore() {
        return rankingCore;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    // Getter và Setter cho roles
    public Set<Roles> getRoles() {
        return roles;
    }

    public void setRoles(Set<Roles> roles) {
        this.roles = roles;
    }

    // Getter và Setter cho topics
    public Set<Topics> getTopics() {
        return topics;
    }

    public void setTopics(Set<Topics> topics) {
        this.topics = topics;
    }
}
