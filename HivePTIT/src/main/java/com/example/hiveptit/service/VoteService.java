package com.example.hiveptit.service;

import com.example.hiveptit.dto.VoteRequest;
import com.example.hiveptit.dto.VoteResponse;
import com.example.hiveptit.model.*;
import com.example.hiveptit.repository.PostRepository;
import com.example.hiveptit.repository.VoteRepository;
import com.example.hiveptit.repository.UserRepository;
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

    @Transactional
    public VoteResponse votePost(VoteRequest request, String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Posts post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Votes.VoteType newVoteType = request.getVoteType().equalsIgnoreCase("UP") 
                ? Votes.VoteType.upvote 
                : Votes.VoteType.downvote;

        Optional<Votes> existingVote = voteRepository.findByVoterAndPost(user, post);

        String action;
        if (existingVote.isPresent()) {
            Votes vote = existingVote.get();
            if (vote.getVoteType() == newVoteType) {
                voteRepository.delete(vote);
                action = "REMOVED";
                updatePostVoteCount(post, vote.getVoteType(), -1);
            } else {
                updatePostVoteCount(post, vote.getVoteType(), -1);
                vote.setVoteType(newVoteType);
                voteRepository.save(vote);
                action = "CHANGED";
                updatePostVoteCount(post, newVoteType, 1);
            }
        } else {
            Votes newVote = new Votes(user, post, null, newVoteType);
            voteRepository.save(newVote);
            action = "ADDED";
            updatePostVoteCount(post, newVoteType, 1);
        }

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

    private void updatePostVoteCount(Posts post, Votes.VoteType voteType, int delta) {
        int currentScore = post.getVoteCount();
        if (voteType == Votes.VoteType.upvote) {
            post.setVoteCount(currentScore + delta);
        } else {
            post.setVoteCount(currentScore - delta);
        }
    }

    private int calculatePostScore(Posts post) {
        int upvotes = voteRepository.countByPostAndVoteType(post, Votes.VoteType.upvote);
        int downvotes = voteRepository.countByPostAndVoteType(post, Votes.VoteType.downvote);
        return upvotes - downvotes;
    }
}
