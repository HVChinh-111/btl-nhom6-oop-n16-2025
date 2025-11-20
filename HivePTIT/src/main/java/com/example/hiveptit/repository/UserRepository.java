package com.example.hiveptit.repository;

import com.example.hiveptit.model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {
    
    // Tìm user theo username
    Optional<Users> findByUsername(String username);
    
    // Tìm user theo email
    Optional<Users> findByEmail(String email);
    
    // Kiểm tra xem username đã tồn tại chưa
    boolean existsByUsername(String username);
    
    // Kiểm tra xem email đã tồn tại chưa
    boolean existsByEmail(String email);
    
    // Kiểm tra xem student_id đã tồn tại chưa
    boolean existsByStudentId(String studentId);

    @Query(
            value = """
                SELECT u.*
                FROM users u
                WHERE MATCH(u.student_id,u.username, u.firstname,u.lastname) AGAINST (:keyword IN BOOLEAN MODE)
                """,
            countQuery = """
                SELECT COUNT(*)
                FROM users u
                WHERE MATCH(u.student_id, u.username, u.firstname, u.lastname) AGAINST (:keyword IN BOOLEAN MODE)
                """,
            nativeQuery = true
    )
    Page<Users> searchFullText(@Param("keyword") String keyword, Pageable pageable);

}
