package com.example.hiveptit.dto;

public class TopicResponse {
    private Integer id;
    private String name;

    public TopicResponse() {}

    public TopicResponse(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}