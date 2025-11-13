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

    public Bookmark_List() {
    }

    public Bookmark_List(Users users, String name) {
        this.users = users;
        this.name = name;
        this.createdAt = Instant.now();
    }

    public Integer getListId() {
        return listId;
    }

    public void setListId(Integer listId) {
        this.listId = listId;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Set<Posts> getPosts() {
        return posts;
    }

    public void setPosts(Set<Posts> posts) {
        this.posts = posts;
    }
}
