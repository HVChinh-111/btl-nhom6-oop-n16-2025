package com.example.hiveptit.model;
import jakarta.persistence.*;
import java.util.*;
@Entity
@Table(name = "topics")
public class Topics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer topicId;

    @Column(unique = true, nullable = false, length = 30)
    private String name;

    @ManyToMany(mappedBy = "topics")
    private Set<Users> users = new HashSet<>();

    @ManyToMany(mappedBy = "topics")
    private Set<Posts> posts = new HashSet<>();

    public Integer getTopicId() {
        return topicId;
    }

    public void setTopicId(Integer topicId) {
        this.topicId = topicId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Users> getUsers() {
        return users;
    }

    public void setUsers(Set<Users> users) {
        this.users = users;
    }

    public Set<Posts> getPosts() {
        return posts;
    }

    public void setPosts(Set<Posts> posts) {
        this.posts = posts;
    }
}
