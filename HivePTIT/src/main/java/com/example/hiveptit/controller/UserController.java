package com.example.hiveptit.controller;

import com.example.hiveptit.dto.UpdateProfileRequest;
import com.example.hiveptit.dto.UpdateProfileResponse;
import com.example.hiveptit.dto.UserProfileResponse;
import com.example.hiveptit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileResponse> getUserProfile(
            @PathVariable String username,
            Authentication authentication) {
        try {
            String currentUsername = null;
            if (authentication != null && authentication.isAuthenticated()) {
                Object principal = authentication.getPrincipal();
                if (principal instanceof UserDetails) {
                    currentUsername = ((UserDetails) principal).getUsername();
                }
            }

            UserProfileResponse profile = userService.getUserProfile(username, currentUsername);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<UpdateProfileResponse> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();

            UserProfileResponse updatedProfile = userService.updateProfile(username, request);
            UpdateProfileResponse response = new UpdateProfileResponse(
                    "Profile updated successfully",
                    true,
                    updatedProfile
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            UpdateProfileResponse response = new UpdateProfileResponse(
                    e.getMessage(),
                    false,
                    null
            );
            return ResponseEntity.badRequest().body(response);
        }
    }
}
