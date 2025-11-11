package com.example.hiveptit.config;

import com.example.hiveptit.filter.JwtAuthenticationFilter;
import com.example.hiveptit.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Bật @PreAuthorize annotation
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. CSRF Protection
            // Tắt CSRF vì dùng JWT (stateless), không dùng cookie/session
            .csrf(csrf -> csrf.disable())
            
            // 2. Authorization Rules (Phân quyền URL)
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - Không cần authentication
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/test/public").permitAll()
                // Protected endpoints - Cần authentication
                // hasRole() tự động thêm prefix "ROLE_"
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/moderator/**").hasAnyRole("ADMIN", "MODERATOR")
                
                // hasAuthority() dùng cho permission (không thêm prefix)
                .requestMatchers("/api/posts/create").hasAuthority("POST_CREATE")
                .requestMatchers("/api/posts/delete/**").hasAuthority("POST_DELETE")
                
                // Vote và Bookmark endpoints - Authenticated users
                .requestMatchers("/api/votes/**").authenticated()
                .requestMatchers("/api/bookmarks/**").authenticated()
                
                // Follow endpoints - Authenticated users
                .requestMatchers("/api/follow/toggle").authenticated()
                .requestMatchers("/api/follow/check").authenticated()
                .requestMatchers("/api/follow/*/followers").permitAll()
                .requestMatchers("/api/follow/*/following").permitAll()
                .requestMatchers("/api/follow/*/stats").permitAll()
                
                // User profile endpoints
                .requestMatchers("/api/users/profile").authenticated()
                .requestMatchers("/api/users/*").permitAll()
                
                // Tất cả request khác cần authentication
                .anyRequest().authenticated()
            )
            
            // 3. Session Management
            // STATELESS: Không tạo session, mỗi request phải có JWT token
            // Khác với session-based: server lưu session, client lưu session ID
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 4. Authentication Provider
            // Đăng ký provider đã tạo ở trên
            .authenticationProvider(authenticationProvider())
            
            // 5. Add JWT Filter
            // Thêm JwtAuthenticationFilter VÀO TRƯỚC UsernamePasswordAuthenticationFilter
            // Tại sao? Vì ta muốn check JWT trước khi Spring Security xử lý authentication
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
