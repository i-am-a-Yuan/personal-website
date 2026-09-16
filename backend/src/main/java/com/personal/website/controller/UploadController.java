package com.personal.website.controller;

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

    // 上传目录：classpath:/static/uploads/ 下，按日期分子目录
    private static final String UPLOAD_DIR = "backend/src/main/resources/static/uploads";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "文件不能为空"));
        }

        // 校验文件类型
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            return ResponseEntity.badRequest().body(Map.of("error", "仅支持 JPG、PNG、GIF、WebP 格式"));
        }

        // 校验文件大小
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(Map.of("error", "图片大小不能超过 5MB"));
        }

        try {
            // 按日期创建子目录：uploads/2026/09/16/
            String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            Path targetDir = Paths.get(UPLOAD_DIR, datePath);
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            // 生成唯一文件名：UUID + 原扩展名
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String newFilename = UUID.randomUUID().toString() + extension;

            // 保存文件
            Path targetPath = targetDir.resolve(newFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // 返回访问 URL（前端直接用这个路径）
            String imageUrl = "/uploads/" + datePath + "/" + newFilename;
            return ResponseEntity.ok(Map.of("url", imageUrl));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "文件保存失败：" + e.getMessage()));
        }
    }
}
