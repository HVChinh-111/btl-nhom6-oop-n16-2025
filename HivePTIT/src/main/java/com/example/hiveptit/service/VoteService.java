package com.example.hiveptit.service;

import com.example.hiveptit.dto.VoteRequest;
import com.example.hiveptit.dto.VoteResponse;
import com.example.hiveptit.model.*;
import com.example.hiveptit.repository.PostRepository;
import com.example.hiveptit.repository.VoteRepository;
import com.example.hiveptit.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EntityManager entityManager;

    @Transactional
    public VoteResponse votePost(VoteRequest request, String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Posts post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Votes.VoteType newVoteType = request.getVoteType().equalsIgnoreCase("UPVOTE") 
                ? Votes.VoteType.upvote 
                : Votes.VoteType.downvote;

        Optional<Votes> existingVote = voteRepository.findByVoterAndPost(user, post);

        String action;
        if (existingVote.isPresent()) {
            Votes vote = existingVote.get();
            if (vote.getVoteType() == newVoteType) {
                // Click same vote again - DELETE vote
                voteRepository.delete(vote);
                entityManager.flush(); // Ensure DELETE is executed immediately
                action = "REMOVED";
            } else {
                // Switch from one vote to another - DELETE old, INSERT new
                voteRepository.delete(vote);
                entityManager.flush(); // Ensure DELETE is committed before INSERT
                Votes newVote = new Votes(user, post, null, newVoteType);
                voteRepository.save(newVote);
                action = "CHANGED";
            }
        } else {
            // New vote - INSERT
            Votes newVote = new Votes(user, post, null, newVoteType);
            voteRepository.save(newVote);
            action = "ADDED";
        }

        // Recalculate total score from database
        int totalScore = calculatePostScore(post);
        post.setVoteCount(totalScore);
        postRepository.save(post);

        return new VoteResponse(
                "Vote " + action.toLowerCase() + " successfully",
                action,
                totalScore,
                true
        );
    }

    private int calculatePostScore(Posts post) {
        int upvotes = voteRepository.countByPostAndVoteType(post, Votes.VoteType.upvote);
        int downvotes = voteRepository.countByPostAndVoteType(post, Votes.VoteType.downvote);
        return upvotes - downvotes;
    }
}
