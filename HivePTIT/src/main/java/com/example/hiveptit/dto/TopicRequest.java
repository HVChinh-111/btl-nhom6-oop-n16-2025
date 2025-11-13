package com.example.hiveptit.dto;

import jakarta.validation.constraints.NotBlank;

public class TopicRequest {
    @NotBlank(message = "tên không được để trống")
    private String name;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}