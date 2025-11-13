package com.example.hiveptit.repository;

import com.example.hiveptit.model.Topics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topics, Integer> {
    // Tìm theo tên (không phân biệt hoa thường)
    Optional<Topics> findByNameIgnoreCase(String name);

    // Kiểm tra có tồn tại theo tên (không phân biệt hoa thường)
    boolean existsByNameIgnoreCase(String name);

    // Tìm kiếm theo keyword trong tên (không phân biệt hoa thường)
    List<Topics> findByNameContainingIgnoreCase(String keyword);

    // Lấy tất cả, sắp xếp theo tên tăng dần
    List<Topics> findAllByOrderByNameAsc();

}