package com.example.hiveptit.repository;

import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Posts, Integer> {
    long countByAuthor(Users author);
}
