package com.example.hiveptit.service;

import com.example.hiveptit.dto.AuthResponse;
import com.example.hiveptit.dto.LoginRequest;
import com.example.hiveptit.dto.SignUpRequest;
import com.example.hiveptit.model.Roles;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.RoleRepository;
import com.example.hiveptit.repository.UserRepository;
import com.example.hiveptit.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private AuthenticationManager authenticationManager;


    public AuthResponse signUp(SignUpRequest request) {
        if (userRepository.existsByStudentId(request.getStudentId())) {
            return new AuthResponse(null, null, null, null, "Student ID đã tồn tại!", false);
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(null, null, null, null, "Username đã tồn tại!", false);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(null, null, null, null, "Email đã tồn tại!", false);
        }

        Users user = new Users();
        user.setStudentId(request.getStudentId());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        
        // Mã hóa password bằng BCrypt
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        user.setIsVerified(Users.IsVerified.Y); // Mặc định verify luôn khi đăng ký
        user.setRankingCore(0);

        // Gán role "Student" mặc định
        // Tìm role Student trong database (role_id = 3 theo data mẫu)
        Optional<Roles> studentRole = roleRepository.findByRoleName("Student");
        if (studentRole.isPresent()) {
            Set<Roles> roles = new HashSet<>();
            roles.add(studentRole.get());
            user.setRoles(roles);
        }

        userRepository.save(user);

        return new AuthResponse(
            null, // Không trả token vì chưa verify email
            user.getStudentId(),
            user.getUsername(),
            user.getEmail(),
            "Đăng ký thành công! Vui lòng xác thực email để đăng nhập.",
            true
        );
    }


    public AuthResponse login(LoginRequest request) {
        try {
            // BƯỚC 1: Authenticate bằng AuthenticationManager
            // Nếu username/password sai -> throw BadCredentialsException
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsernameOrEmail(),
                    request.getPassword()
                )
            );

            // BƯỚC 2: Load UserDetails (có thể từ authentication hoặc load lại)
            // Cần load lại để có thể support login bằng email
            UserDetails userDetails;
            if (request.getUsernameOrEmail().contains("@")) {
                // Login bằng email
                userDetails = userDetailsService.loadUserByEmail(request.getUsernameOrEmail());
            } else {
                // Login bằng username
                userDetails = userDetailsService.loadUserByUsername(request.getUsernameOrEmail());
            }

            // BƯỚC 3: Load thông tin user từ database để lấy roles
            Optional<Users> userOpt = userRepository.findByUsername(userDetails.getUsername());
            if (userOpt.isEmpty()) {
                return new AuthResponse(null, null, null, null, "User not found!", false);
            }
            Users user = userOpt.get();

            // Check xem user đã verify email chưa
            if (user.getIsVerified() == Users.IsVerified.N) {
                return new AuthResponse(null, null, null, null, 
                    "Tài khoản chưa được xác thực! Vui lòng kiểm tra email.", false);
            }

            // BƯỚC 4: Generate JWT token
            String token = jwtUtil.generateToken(userDetails);

            // BƯỚC 5: Lấy danh sách roles để trả về
            Set<String> roles = user.getRoles().stream()
                .map(Roles::getRoleName)
                .collect(Collectors.toSet());

            // BƯỚC 6: Return success response với token
            return new AuthResponse(
                token,
                user.getStudentId(),
                user.getUsername(),
                user.getEmail(),
                "Đăng nhập thành công!",
                true
            );

        } catch (BadCredentialsException e) {
            // Username hoặc password không đúng
            return new AuthResponse(null, null, null, null, 
                "Username hoặc mật khẩu không chính xác!", false);
        } catch (Exception e) {
            // Lỗi khác
            return new AuthResponse(null, null, null, null, 
                "Đăng nhập thất bại: " + e.getMessage(), false);
        }
    }

    /**
     * Đăng xuất 
     * 
     * CHÚ Ý VỀ JWT LOGOUT:
     * - JWT là stateless, server không lưu trạng thái
     * - Không thể "thu hồi" token đã phát hành
     * - Cách đơn giản: Client xóa token
     * - Cách phức tạp: Dùng blacklist (lưu token bị revoke vào Redis/DB)
     * 
     * Hiện tại chỉ return message, client tự xóa token
     */
    public AuthResponse logout() {
        return new AuthResponse(null, null, null, null, "Đăng xuất thành công!", true);
    }
}
