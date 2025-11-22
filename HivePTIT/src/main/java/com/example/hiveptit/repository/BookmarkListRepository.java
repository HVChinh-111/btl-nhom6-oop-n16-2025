package com.example.hiveptit.repository;

import com.example.hiveptit.model.Bookmark_List;
import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface BookmarkListRepository extends JpaRepository<Bookmark_List, Integer> {
    Optional<Bookmark_List> findByUsersAndName(Users users, String name);
    List<Bookmark_List> findByUsers(Users users);
    Page<Bookmark_List> findByUsers(Users user, Pageable pageable);

    @Query("select b.posts from Bookmark_List b where b.users = :user")
    Page<Posts> findBookmarkedPostsByUsers(@Param("user") Users user, Pageable pageable);

}
