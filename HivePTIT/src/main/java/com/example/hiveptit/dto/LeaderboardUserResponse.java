package com.example.hiveptit.dto;

public class LeaderboardUserResponse {
    
    private Integer rank;
    private String studentId;
    private String username;
    private String firstname;
    private String lastname;
    private String avatarUrl;
    private Integer rankingCore;
    private Long postCount;
    private Long followerCount;

    public LeaderboardUserResponse() {
    }

    public LeaderboardUserResponse(Integer rank, String studentId, String username, 
                                   String firstname, String lastname, String avatarUrl, 
                                   Integer rankingCore, Long postCount, Long followerCount) {
        this.rank = rank;
        this.studentId = studentId;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.avatarUrl = avatarUrl;
        this.rankingCore = rankingCore;
        this.postCount = postCount;
        this.followerCount = followerCount;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
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

    public Integer getRankingCore() {
        return rankingCore;
    }

    public void setRankingCore(Integer rankingCore) {
        this.rankingCore = rankingCore;
    }

    public Long getPostCount() {
        return postCount;
    }

    public void setPostCount(Long postCount) {
        this.postCount = postCount;
    }

    public Long getFollowerCount() {
        return followerCount;
    }

    public void setFollowerCount(Long followerCount) {
        this.followerCount = followerCount;
    }
}
