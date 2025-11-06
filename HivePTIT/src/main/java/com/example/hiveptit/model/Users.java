package com.example.hiveptit.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class Users {

    @Id
    @Column(name = "student_id", length = 10, nullable = false)
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
}