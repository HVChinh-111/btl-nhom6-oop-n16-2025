package com.example.hiveptit.repository;

import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Topics;
import com.example.hiveptit.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Posts, Integer> {
    // tìm post theo id
    Optional<Posts> findById(Integer Id);
}
