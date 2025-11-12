package com.example.hiveptit.controller;

import com.example.hiveptit.dto.BookmarkRequest;
import com.example.hiveptit.dto.BookmarkResponse;
import com.example.hiveptit.model.Bookmark_List;
import com.example.hiveptit.service.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    @PostMapping("/list/create")
    public ResponseEntity<BookmarkResponse> createList(
            @RequestParam String listName,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        BookmarkResponse response = bookmarkService.createList(listName, username);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<BookmarkResponse> addPostToList(
            @RequestBody BookmarkRequest request,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        BookmarkResponse response = bookmarkService.addPostToList(request, username);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<BookmarkResponse> removePostFromList(
            @RequestBody BookmarkRequest request,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        BookmarkResponse response = bookmarkService.removePostFromList(request, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/lists")
    public ResponseEntity<List<Bookmark_List>> getUserBookmarkLists(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        List<Bookmark_List> lists = bookmarkService.getUserBookmarkLists(username);
        return ResponseEntity.ok(lists);
    }
}
