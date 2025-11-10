package com.example.hiveptit.dto;

public class UserSummaryDTO {
    private String studentId;
    private String username;
    private String firstname;
    private String lastname;
    private String avatarUrl;
    private String bio;
    private Integer rankingCore;
    private boolean isFollowing;

    public UserSummaryDTO() {
    }

    public UserSummaryDTO(String studentId, String username, String firstname, String lastname, 
                          String avatarUrl, String bio, Integer rankingCore, boolean isFollowing) {
        this.studentId = studentId;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.rankingCore = rankingCore;
        this.isFollowing = isFollowing;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public Integer getRankingCore() {
        return rankingCore;
    }

    public void setRankingCore(Integer rankingCore) {
        this.rankingCore = rankingCore;
    }

    public boolean isFollowing() {
        return isFollowing;
    }

    public void setFollowing(boolean following) {
        isFollowing = following;
    }
}
