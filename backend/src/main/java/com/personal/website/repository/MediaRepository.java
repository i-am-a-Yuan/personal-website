package com.personal.website.repository;

import com.personal.website.entity.Media;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {

    // 按创建时间倒序分页查询
    Page<Media> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // 按分类查询
    Page<Media> findByCategoryOrderByCreatedAtDesc(String category, Pageable pageable);
}
