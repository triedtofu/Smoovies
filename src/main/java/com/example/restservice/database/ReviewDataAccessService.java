package com.example.restservice.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.Movie;
import com.example.restservice.dataModels.Review;

@Repository
public interface ReviewDataAccessService extends JpaRepository<Review, Long> {
    long deleteByMovie(Movie movie);

    @Query(value = "SELECT * FROM reviews r WHERE r.movie_id = :movie_id AND r.user_id = :user_id", nativeQuery = true)
    public Review findReview(@Param("movie_id") Long movie_id, @Param("user_id") Long user_id);
    
}
