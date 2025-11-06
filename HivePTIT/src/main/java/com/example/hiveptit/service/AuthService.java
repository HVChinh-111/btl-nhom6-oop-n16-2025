package com.example.hiveptit.service;

import com.example.hiveptit.dto.AuthResponse;
import com.example.hiveptit.dto.LoginRequest;
import com.example.hiveptit.dto.SignUpRequest;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Đăng ký tài khoản mới
     */
    public AuthResponse signUp(SignUpRequest request) {
        if (userRepository.existsByStudentId(request.getStudentId())) {
            return new AuthResponse(null, null, null, "Student ID đã tồn tại!", false);
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(null, null, null, "Username đã tồn tại!", false);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(null, null, null, "Email đã tồn tại!", false);
        }

        Users user = new Users();
        user.setStudentId(request.getStudentId());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        user.setIsVerified(Users.IsVerified.N);
        user.setRankingCore(0);

        userRepository.save(user);

        return new AuthResponse(
            user.getStudentId(),
            user.getUsername(),
            user.getEmail(),
            "Đăng ký thành công! Vui lòng xác thực email để đăng nhập.",
            true
        );
    }

    /**
     * Đăng nhập
     */
    public AuthResponse login(LoginRequest request) {
        Optional<Users> userOpt = userRepository.findByUsername(request.getUsernameOrEmail());
        
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getUsernameOrEmail());
        }

        if (userOpt.isEmpty()) {
            return new AuthResponse(null, null, null, "Username hoặc Email không tồn tại!", false);
        }

        Users user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return new AuthResponse(null, null, null, "Mật khẩu không chính xác!", false);
        }

        if (user.getIsVerified() == Users.IsVerified.N) {
            return new AuthResponse(null, null, null, "Tài khoản chưa được xác thực! Vui lòng kiểm tra email.", false);
        }

        return new AuthResponse(
            user.getStudentId(),
            user.getUsername(),
            user.getEmail(),
            "Đăng nhập thành công!",
            true
        );
    }

    /**
     * Đăng xuất 
     */
    public AuthResponse logout() {
        return new AuthResponse(null, null, null, "Đăng xuất thành công!", true);
    }
}
