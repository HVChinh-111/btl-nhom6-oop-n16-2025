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
}
