package com.example.hiveptit.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BookmarkListDTO {
    private Integer listId;
    private String name;
    private LocalDateTime createdAt;
    private List<BookmarkPostDTO> posts;

    public BookmarkListDTO() {
    }

    public BookmarkListDTO(Integer listId, String name, LocalDateTime createdAt, List<BookmarkPostDTO> posts) {
        this.listId = listId;
        this.name = name;
        this.createdAt = createdAt;
        this.posts = posts;
    }

    public Integer getListId() {
        return listId;
    }

    public void setListId(Integer listId) {
        this.listId = listId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<BookmarkPostDTO> getPosts() {
        return posts;
    }

    public void setPosts(List<BookmarkPostDTO> posts) {
        this.posts = posts;
    }

    public static class BookmarkPostDTO {
        private Integer postId;
        private String title;
        private LocalDateTime createdAt;
        private BookmarkAuthorDTO author;

        public BookmarkPostDTO() {
        }

        public BookmarkPostDTO(Integer postId, String title, LocalDateTime createdAt, BookmarkAuthorDTO author) {
            this.postId = postId;
            this.title = title;
            this.createdAt = createdAt;
            this.author = author;
        }

        public Integer getPostId() {
            return postId;
        }

        public void setPostId(Integer postId) {
            this.postId = postId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public BookmarkAuthorDTO getAuthor() {
            return author;
        }

        public void setAuthor(BookmarkAuthorDTO author) {
            this.author = author;
        }
    }

    public static class BookmarkAuthorDTO {
        private String username;
        private String firstname;
        private String lastname;

        public BookmarkAuthorDTO() {
        }

        public BookmarkAuthorDTO(String username, String firstname, String lastname) {
            this.username = username;
            this.firstname = firstname;
            this.lastname = lastname;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getFirstname() {
            return firstname;
        }

        public void setFirstname(String firstname) {
            this.firstname = firstname;
        }

        public String getLastname() {
            return lastname;
        }

        public void setLastname(String lastname) {
            this.lastname = lastname;
        }
    }
}
