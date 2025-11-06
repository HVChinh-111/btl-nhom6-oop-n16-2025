package com.example.hiveptit.repository;

import com.example.hiveptit.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
