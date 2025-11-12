package com.example.hiveptit.repository;

import com.example.hiveptit.model.Bookmark_List;
import com.example.hiveptit.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface BookmarkListRepository extends JpaRepository<Bookmark_List, Integer> {
    Optional<Bookmark_List> findByUsersAndName(Users users, String name);
    List<Bookmark_List> findByUsers(Users users);
}
