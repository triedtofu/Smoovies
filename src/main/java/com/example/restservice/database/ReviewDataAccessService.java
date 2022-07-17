package com.example.restservice.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.Movie;
import com.example.restservice.dataModels.Review;

@Repository
public interface ReviewDataAccessService extends JpaRepository<Review, Long> {
    long deleteByMovie(Movie movie);
    
}
