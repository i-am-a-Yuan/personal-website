package com.personal.website.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "media")
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 显示用的文件名（用户可读，可以重命名）
    @Column(nullable = false)
    private String filename;

    // 磁盘上存储的文件名（UUID，保证唯一）
    @Column(nullable = false, unique = true)
    private String storedFilename;

    // 文件存储的相对路径（如 2026/09/17/）
    @Column(nullable = false)
    private String filepath;

    // 文件大小（字节）
    private Long fileSize;

    // MIME 类型（如 image/jpeg）
    private String mimeType;

    // 引用计数：被多少地方使用
    @Column(nullable = false)
    private Integer refCount = 0;

    // 分类（预留，如 article/project/avatar）
    private String category;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // 获取完整的相对路径（filepath + storedFilename）
    public String getFullPath() {
        return filepath + storedFilename;
    }
}
