package com.example.hiveptit.repository;

import com.example.hiveptit.model.Votes;
import com.example.hiveptit.model.Users;
import com.example.hiveptit.model.Posts;
import com.example.hiveptit.model.Comments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Votes, Integer> {
    Optional<Votes> findByVoterAndPost(Users voter, Posts post);
    Optional<Votes> findByVoterAndComment(Users voter, Comments comment);
    int countByPostAndVoteType(Posts post, Votes.VoteType voteType);
    int countByCommentAndVoteType(Comments comment, Votes.VoteType voteType);
}
