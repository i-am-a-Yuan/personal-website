package com.personal.website.controller;

import com.personal.website.entity.Media;
import com.personal.website.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/admin/upload")
@CrossOrigin
public class UploadController {

    @Value("${app.upload-dir:./uploads}")
    private String uploadDir;

    private final MediaRepository mediaRepository;

    public UploadController(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    @PostMapping("/image")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "文件不能为空"));
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            return ResponseEntity.badRequest().body(Map.of("error", "仅支持 JPG、PNG、GIF、WebP 格式"));
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(Map.of("error", "图片大小不能超过 5MB"));
        }

        try {
            String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "/";
            Path targetDir = Paths.get(uploadDir, datePath);
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }
            // 文件名处理
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String storedFilename = UUID.randomUUID().toString() + extension;

            Path targetPath = targetDir.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // 写入媒体库数据库记录
            Media media = new Media();
            media.setFilename(originalFilename != null ? originalFilename : storedFilename);
            media.setStoredFilename(storedFilename);
            media.setFilepath(datePath);
            media.setFileSize(file.getSize());
            media.setMimeType(file.getContentType());
            media.setRefCount(0);
            Media saved = mediaRepository.save(media);

            // 返回 id + url（url 兼容旧用法，新代码用 id 通过 /api/public/media/{id} 访问）
            String legacyUrl = "/uploads/" + datePath + storedFilename;
            Map<String, Object> result = new HashMap<>();
            result.put("id", saved.getId());
            result.put("url", legacyUrl);
            result.put("filename", saved.getFilename());
            return ResponseEntity.ok(result);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "文件保存失败：" + e.getMessage()));
        }
    }
}
