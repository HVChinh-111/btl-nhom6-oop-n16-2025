package com.example.hiveptit.service;

import com.example.hiveptit.dto.BookmarkRequest;
import com.example.hiveptit.dto.BookmarkResponse;
import com.example.hiveptit.model.Bookmark_List;
import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.repository.BookmarkListRepository;
import com.example.hiveptit.repository.PostRepository;
import com.example.hiveptit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class BookmarkService {

    @Autowired
    private BookmarkListRepository bookmarkListRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public BookmarkResponse createList(String listName, String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (bookmarkListRepository.findByUsersAndName(user, listName).isPresent()) {
            return new BookmarkResponse("Bookmark list already exists", false, null, null, null);
        }

        Bookmark_List bookmarkList = new Bookmark_List(user, listName);
        bookmarkList = bookmarkListRepository.save(bookmarkList);

        LocalDateTime createdAt = LocalDateTime.ofInstant(bookmarkList.getCreatedAt(), ZoneId.systemDefault());

        return new BookmarkResponse(
                "Bookmark list created successfully",
                true,
                bookmarkList.getListId(),
                bookmarkList.getName(),
                createdAt
        );
    }

    @Transactional
    public BookmarkResponse addPostToList(BookmarkRequest request, String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Bookmark_List bookmarkList = bookmarkListRepository.findByUsersAndName(user, request.getListName())
                .orElseGet(() -> {
                    Bookmark_List newList = new Bookmark_List(user, request.getListName());
                    return bookmarkListRepository.save(newList);
                });

        Posts post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (bookmarkList.getPosts().contains(post)) {
            return new BookmarkResponse("Post already in bookmark list", false, bookmarkList.getListId(), bookmarkList.getName(), null);
        }

        bookmarkList.getPosts().add(post);
        bookmarkListRepository.save(bookmarkList);

        LocalDateTime createdAt = LocalDateTime.ofInstant(bookmarkList.getCreatedAt(), ZoneId.systemDefault());

        return new BookmarkResponse(
                "Post added to bookmark list",
                true,
                bookmarkList.getListId(),
                bookmarkList.getName(),
                createdAt
        );
    }

    @Transactional
    public BookmarkResponse removePostFromList(BookmarkRequest request, String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Bookmark_List bookmarkList = bookmarkListRepository.findByUsersAndName(user, request.getListName())
                .orElseThrow(() -> new RuntimeException("Bookmark list not found"));

        Posts post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!bookmarkList.getPosts().contains(post)) {
            return new BookmarkResponse("Post not in bookmark list", false, bookmarkList.getListId(), bookmarkList.getName(), null);
        }

        bookmarkList.getPosts().remove(post);
        bookmarkListRepository.save(bookmarkList);

        LocalDateTime createdAt = LocalDateTime.ofInstant(bookmarkList.getCreatedAt(), ZoneId.systemDefault());

        return new BookmarkResponse(
                "Post removed from bookmark list",
                true,
                bookmarkList.getListId(),
                bookmarkList.getName(),
                createdAt
        );
    }

    public List<Bookmark_List> getUserBookmarkLists(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookmarkListRepository.findByUsers(user);
    }
}
