package com.example.hiveptit.controller;

import com.example.hiveptit.dto.AuthResponse;
import com.example.hiveptit.dto.LoginRequest;
import com.example.hiveptit.dto.SignUpRequest;
import com.example.hiveptit.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Cho phép CORS từ mọi nguồn (production nên giới hạn)
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * API Đăng ký
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        AuthResponse response = authService.signUp(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * API Đăng nhập
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * API Đăng xuất
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        AuthResponse response = authService.logout();
        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint
     * GET /api/auth/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Auth API is running!");
    }
}
