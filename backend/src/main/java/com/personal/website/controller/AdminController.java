package com.personal.website.controller;

import com.personal.website.config.JwtService;
import com.personal.website.entity.*;
import com.personal.website.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {
    
    private final ArticleRepository articleRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminController(ArticleRepository articleRepository,
                          ProjectRepository projectRepository,
                          SkillRepository skillRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.articleRepository = articleRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }
    
    // === Article Management ===
    @GetMapping("/articles")
    public ResponseEntity<Page<Article>> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(articleRepository.findAll(pageable));
    }
    
    @PostMapping("/articles")
    public ResponseEntity<Article> createArticle(@RequestBody Article article) {
        return ResponseEntity.ok(articleRepository.save(article));
    }
    
    @PutMapping("/articles/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id, @RequestBody Article article) {
        return articleRepository.findById(id)
            .map(existing -> {
                existing.setTitle(article.getTitle());
                existing.setSummary(article.getSummary());
                existing.setContent(article.getContent());
                existing.setCoverImage(article.getCoverImage());
                existing.setCategory(article.getCategory());
                existing.setTags(article.getTags());
                existing.setPublished(article.getPublished());
                return ResponseEntity.ok(articleRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/articles/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // === Project Management ===
    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }
    
    @PostMapping("/projects")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectRepository.save(project));
    }
    
    @PutMapping("/projects/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        return projectRepository.findById(id)
            .map(existing -> {
                existing.setName(project.getName());
                existing.setDescription(project.getDescription());
                existing.setCoverImage(project.getCoverImage());
                existing.setTechStack(project.getTechStack());
                existing.setGithubUrl(project.getGithubUrl());
                existing.setDemoUrl(project.getDemoUrl());
                existing.setFeatured(project.getFeatured());
                existing.setDisplayOrder(project.getDisplayOrder());
                return ResponseEntity.ok(projectRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // === Skill Management ===
    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillRepository.findAll());
    }
    
    @PostMapping("/skills")
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        return ResponseEntity.ok(skillRepository.save(skill));
    }
    
    @PutMapping("/skills/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @RequestBody Skill skill) {
        return skillRepository.findById(id)
            .map(existing -> {
                existing.setName(skill.getName());
                existing.setCategory(skill.getCategory());
                existing.setProficiency(skill.getProficiency());
                existing.setIcon(skill.getIcon());
                existing.setDisplayOrder(skill.getDisplayOrder());
                return ResponseEntity.ok(skillRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // === Profile Management ===
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        return userRepository.findAll().stream()
            .findFirst()
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User profile) {
        return userRepository.findAll().stream()
            .findFirst()
            .map(existing -> {
                existing.setNickname(profile.getNickname());
                existing.setBio(profile.getBio());
                existing.setLocation(profile.getLocation());
                existing.setWebsite(profile.getWebsite());
                existing.setGithub(profile.getGithub());
                existing.setTwitter(profile.getTwitter());
                existing.setLinkedin(profile.getLinkedin());
                existing.setEmailPublic(profile.getEmailPublic());
                existing.setTags(profile.getTags());
                existing.setWelcomeText(profile.getWelcomeText());
                existing.setCtaTitle(profile.getCtaTitle());
                existing.setCtaDescription(profile.getCtaDescription());
                existing.setCoffeeCount(profile.getCoffeeCount());
                existing.setStarsCount(profile.getStarsCount());
                // 多语言字段更新
                existing.setBioEn(profile.getBioEn());
                existing.setTagsEn(profile.getTagsEn());
                existing.setWelcomeTextEn(profile.getWelcomeTextEn());
                existing.setCtaTitleEn(profile.getCtaTitleEn());
                existing.setCtaDescriptionEn(profile.getCtaDescriptionEn());
                return ResponseEntity.ok(userRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // === Account Management ===

    /**
     * 修改密码
     * 请求体：{ "oldPassword": "...", "newPassword": "..." }
     */
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "新密码长度不能少于6位"));
        }

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByUsername(currentUsername)
            .map(user -> {
                if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                    return ResponseEntity.badRequest().body(Map.of("message", "旧密码不正确"));
                }
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return ResponseEntity.ok(Map.of("message", "密码修改成功"));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 修改用户名
     * 请求体：{ "newUsername": "...", "password": "..." }
     * 返回新的 token（用户名变更后旧 token 失效）
     */
    @PutMapping("/username")
    public ResponseEntity<?> changeUsername(@RequestBody Map<String, String> request) {
        String newUsername = request.get("newUsername");
        String password = request.get("password");

        if (newUsername == null || newUsername.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "用户名不能为空"));
        }
        newUsername = newUsername.trim();

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        // 如果新用户名和当前用户名相同，直接返回
        if (newUsername.equals(currentUsername)) {
            return ResponseEntity.badRequest().body(Map.of("message", "新用户名不能与当前用户名相同"));
        }
        // 确定写入新用户名
        String finalNewUsername = newUsername;
        return userRepository.findByUsername(currentUsername)
            .map(user -> {
                // 验证密码
                if (!passwordEncoder.matches(password, user.getPassword())) {
                    return ResponseEntity.badRequest().body(Map.of("message", "密码不正确"));
                }
                // 检查新用户名是否已被占用
                if (userRepository.existsByUsername(finalNewUsername)) {
                    return ResponseEntity.badRequest().body(Map.of("message", "该用户名已被使用"));
                }
                // 更新用户名
                user.setUsername(finalNewUsername);
                userRepository.save(user);
                // 生成新 token
                org.springframework.security.core.userdetails.User userDetails =
                    new org.springframework.security.core.userdetails.User(
                        user.getUsername(),
                        user.getPassword(),
                        List.of(() -> "ROLE_" + user.getRole())
                    );
                String newToken = jwtService.generateToken(userDetails);
                return ResponseEntity.ok(Map.of(
                    "message", "用户名修改成功",
                    "token", newToken,
                    "username", finalNewUsername
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}