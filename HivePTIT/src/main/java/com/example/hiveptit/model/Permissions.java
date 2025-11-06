package com.example.hiveptit.model;
import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "permissions")
public class Permissions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer permissionId;

    @Column(unique = true, nullable = false, length = 30)
    private String code;

    @Lob
    private String description;

    @ManyToMany(mappedBy = "permissions")
    private Set<Roles> roles = new HashSet<>();
}
