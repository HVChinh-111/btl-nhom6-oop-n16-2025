package com.example.hiveptit.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SignUpRequest {

    @NotBlank(message = "Student ID không được để trống")
    @Size(min = 10, max = 10, message = "Student ID phải có đúng 10 ký tự")
    private String studentId;

    @NotBlank(message = "Username không được để trống")
    @Size(min = 3, max = 30, message = "Username phải có từ 3-30 ký tự")
    private String username;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Pattern(regexp = ".*@ptit\\.edu\\.vn$", message = "Email phải có đuôi @ptit.edu.vn")
    private String email;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, max = 30, message = "Password phải có từ 6-30 ký tự")
    private String password;

    private String firstname;
    
    private String lastname;

    public SignUpRequest() {
    }

    public String getStudentId() {
        return studentId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }
}