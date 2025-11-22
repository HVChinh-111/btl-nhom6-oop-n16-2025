package com.example.hiveptit.service;

import com.example.hiveptit.dto.PostRequest;
import com.example.hiveptit.dto.PostResponse;
import com.example.hiveptit.dto.UserSummaryDTO;
import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Topics;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.model.Votes;
import com.example.hiveptit.repository.PostRepository;
import com.example.hiveptit.repository.TopicRepository;
import com.example.hiveptit.repository.UserRepository;
import com.example.hiveptit.repository.VoteRepository;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;
    private final Parser markdownParser;
    private final HtmlRenderer htmlRenderer;

    public PostService(PostRepository postRepository, TopicRepository topicRepository, UserRepository userRepository, VoteRepository voteRepository) {
        this.postRepository = postRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
        this.voteRepository = voteRepository;
        this.markdownParser = Parser.builder().build();
        this.htmlRenderer = HtmlRenderer.builder().build();
    }

    // Chuyển đổi Markdown sang HTML
    private String convertMarkdownToHtml(String markdown) {
        if (markdown == null || markdown.isEmpty()) {
            return "";
        }
        var document = markdownParser.parse(markdown);
        return htmlRenderer.render(document);
    }
    // tạo bài viết mới
    @Transactional
    public PostResponse createPost(PostRequest req, String username) {
        Users author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy người dùng"));

        Posts post = new Posts();
        post.setAuthor(author);
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        post.setCreatedAt(Instant.now());
        post.setUpdatedAt(Instant.now());

        if (req.getTopicIds() != null && !req.getTopicIds().isEmpty()) {
            List<Topics> topics = topicRepository.findAllById(req.getTopicIds());
            Set<Topics> topicSet = topics.stream().collect(Collectors.toSet());
            post.setTopics(topicSet);
        }

        Posts saved = postRepository.save(post);
        return toResponse(saved, username);
    }
    // sửa bài viết (người viết bài mới được sửa)
    @Transactional
    public PostResponse updatePost(Integer id, PostRequest req, String username) {
        Posts post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bài viết không tồn tại"));

        if (!post.getAuthor().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền sửa bài viết này");
        }

        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        post.setUpdatedAt(Instant.now());

        if (req.getTopicIds() != null) {
            List<Topics> topics = topicRepository.findAllById(req.getTopicIds());
            post.setTopics(topics.stream().collect(Collectors.toSet()));
        }


        Posts saved = postRepository.save(post);
        return toResponse(saved, username);
    }

    // XÓA CỨNG(admin,người tạo)
    @Transactional
    public void hardDeletePost(Integer id, String username) {
        Posts post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bài viết không tồn tại"));

        Users caller = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy người dùng"));

        boolean isOwner = post.getAuthor() != null && username.equals(post.getAuthor().getUsername());
        boolean isAdmin = caller.getRoles() != null && caller.getRoles().stream()
                .anyMatch(r -> {
                    String name = r.getRoleName();
                    return name != null && (name.equalsIgnoreCase("ADMIN") || name.equalsIgnoreCase("ROLE_ADMIN"));
                });

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền xóa bài viết này");
        }

        postRepository.delete(post);
    }

    // xem chi tiết bài viết
    @Transactional(readOnly = true)
    public PostResponse getPost(Integer id, String username) {
        Posts post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bài viết không tồn tại"));
        return toResponse(post, false, username);
    }

    // Overload để hỗ trợ includeRawContent từ controller
    @Transactional(readOnly = true)
    public PostResponse getPost(Integer id, boolean includeRawContent, String username) {
        Posts post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bài viết không tồn tại"));
        return toResponse(post, includeRawContent, username);
    }


    private PostResponse toResponse(Posts post, String username) {
        return toResponse(post, false, username);
    }

    // Overload method để có thể lấy markdown gốc khi cần edit
    private PostResponse toResponse(Posts post, boolean includeRawContent, String username) {
        PostResponse resp = new PostResponse();
        resp.setId(post.getPostId());
        resp.setTitle(post.getTitle());
        // Content là HTML để hiển thị
        resp.setContent(convertMarkdownToHtml(post.getContent()));
        // RawContent là markdown gốc (chỉ khi cần edit)
        if (includeRawContent) {
            resp.setRawContent(post.getContent());
        }
        resp.setCreatedAt(post.getCreatedAt());
        resp.setUpdatedAt(post.getUpdatedAt());
        resp.setVoteCount(post.getVoteCount());
        
        // Set user vote type if user is logged in
        if (username != null) {
            Users user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                voteRepository.findByVoterAndPost(user, post).ifPresent(vote -> {
                    if (vote.getVoteType() == Votes.VoteType.upvote) {
                        resp.setUserVoteType("UPVOTE");
                    } else if (vote.getVoteType() == Votes.VoteType.downvote) {
                        resp.setUserVoteType("DOWNVOTE");
                    }
                });
            }
        }
        
        if (post.getAuthor() != null) {
            resp.setAuthor(new UserSummaryDTO(
                    post.getAuthor().getStudentId(),
                    post.getAuthor().getUsername(),
                    post.getAuthor().getFirstname(),   // nếu không có, có thể để null
                    post.getAuthor().getLastname(),    // nếu không có, có thể để null
                    post.getAuthor().getAvatarUrl(),   // nếu không có, có thể để null
                    post.getAuthor().getBio(),         // nếu không có, có thể để null
                    post.getAuthor().getRankingCore(), // nếu không có, có thể để null
                    false                              // isFollowing: mặc định false nếu chưa có logic
            ));

        }

        if (post.getTopics() != null) {
            resp.setTopics(post.getTopics().stream()
                    .map(t -> new PostResponse.TopicSummary(t.getTopicId(), t.getName()))
                    .collect(Collectors.toList()));
        }
        return resp;
    }
}