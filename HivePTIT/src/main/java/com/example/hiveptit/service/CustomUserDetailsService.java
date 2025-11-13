package com.example.hiveptit.service;

import com.example.hiveptit.model.Permissions;
import com.example.hiveptit.model.Roles;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        Users user;
        
        if (usernameOrEmail.contains("@")) {
            user = userRepository.findByEmail(usernameOrEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + usernameOrEmail));
        } else {
            user = userRepository.findByUsername(usernameOrEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + usernameOrEmail));
        }

        Collection<? extends GrantedAuthority> authorities = getAuthorities(user);

        return User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(user.getIsVerified() == Users.IsVerified.N)
                .build();
    }

    private Collection<? extends GrantedAuthority> getAuthorities(Users user) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        // Lấy roles của user
        Set<Roles> roles = user.getRoles();
        
        for (Roles role : roles) {
            // Thêm role với prefix "ROLE_"
            // SimpleGrantedAuthority là implementation của GrantedAuthority
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRoleName().toUpperCase()));
            
            // Lấy permissions của role này
            Set<Permissions> permissions = role.getPermissions();
            
            // Thêm tất cả permissions (không có prefix)
            // Stream API: map code của permission thành SimpleGrantedAuthority
            authorities.addAll(
                permissions.stream()
                    .map(permission -> new SimpleGrantedAuthority(permission.getCode()))
                    .collect(Collectors.toSet())
            );
        }

        return authorities;
    }
}
