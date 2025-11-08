package com.example.hiveptit.model;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "follows")
public class Follows {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private Users follower;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id", nullable = false)
    private Users following;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();
}
