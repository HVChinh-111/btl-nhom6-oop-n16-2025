package com.example.hiveptit.model;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "follows")
@IdClass(Follows.FollowsId.class)
public class Follows {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false, columnDefinition = "CHAR(10)")
    private Users follower;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id", nullable = false, columnDefinition = "CHAR(10)")
    private Users following;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public Follows() {
    }

    public Follows(Users follower, Users following) {
        this.follower = follower;
        this.following = following;
        this.createdAt = Instant.now();
    }

    public Users getFollower() {
        return follower;
    }

    public void setFollower(Users follower) {
        this.follower = follower;
    }

    public Users getFollowing() {
        return following;
    }

    public void setFollowing(Users following) {
        this.following = following;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public static class FollowsId implements Serializable {
        private String follower;
        private String following;

        public FollowsId() {
        }

        public FollowsId(String follower, String following) {
            this.follower = follower;
            this.following = following;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            FollowsId followsId = (FollowsId) o;
            return Objects.equals(follower, followsId.follower) &&
                   Objects.equals(following, followsId.following);
        }

        @Override
        public int hashCode() {
            return Objects.hash(follower, following);
        }
    }
}
