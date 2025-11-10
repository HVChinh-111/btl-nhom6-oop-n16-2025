package com.example.hiveptit.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public Map<String, Object> publicEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "This is a public endpoint!");
        response.put("description", "Anyone can access this without authentication");
        return response;
    }


    @GetMapping("/authenticated")
    public Map<String, Object> authenticatedEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "You are authenticated!");
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        return response;
    }


    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> adminEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome Admin!");
        response.put("description", "Only users with ADMIN role can access this");
        response.put("username", authentication.getName());
        return response;
    }


    @GetMapping("/moderator")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public Map<String, Object> moderatorEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome Moderator!");
        response.put("description", "Users with ADMIN or MODERATOR role can access this");
        response.put("username", authentication.getName());
        response.put("roles", authentication.getAuthorities());
        return response;
    }

    @GetMapping("/create-post")
    @PreAuthorize("hasAuthority('POST_CREATE')")
    public Map<String, Object> createPostEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "You can create posts!");
        response.put("description", "Only users with POST_CREATE permission can access");
        response.put("username", authentication.getName());
        response.put("permissions", authentication.getAuthorities());
        return response;
    }

    @GetMapping("/admin-delete")
    @PreAuthorize("hasAuthority('POST_DELETE') and hasAuthority('USER_MANAGE')")
    public Map<String, Object> adminDeleteEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "You can delete posts and manage users!");
        response.put("description", "Need both POST_DELETE and USER_MANAGE permissions");
        response.put("username", authentication.getName());
        return response;
    }


    @GetMapping("/edit-post")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('POST_EDIT')")
    public Map<String, Object> editPostEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "You can edit posts!");
        response.put("description", "Admin or users with POST_EDIT permission can access");
        response.put("username", authentication.getName());
        return response;
    }


    @GetMapping("/me")
    public Map<String, Object> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        response.put("authenticated", authentication.isAuthenticated());
        response.put("details", authentication.getDetails());
        return response;
    }
}
