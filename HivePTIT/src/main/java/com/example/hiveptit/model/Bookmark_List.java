package com.example.hiveptit.model;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;
@Entity
@Table(name = "bookmark_list",
        uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "name"})
)
public class Bookmark_List {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer listId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Users users;

    @Column(name = "name", length = 50)
    private String name;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @ManyToMany
    @JoinTable(
            name = "book_post",
            joinColumns = @JoinColumn(name = "list_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    private Set<Posts> posts = new HashSet<>();
}
