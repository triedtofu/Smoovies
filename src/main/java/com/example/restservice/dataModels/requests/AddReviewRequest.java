package com.example.restservice.dataModels.requests;

import com.example.restservice.dataModels.Review;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AddReviewRequest {

    private String token;

    private String reviewText;

    private Long movie_id;
    
    private int rating;
    
    public AddReviewRequest(
        @JsonProperty("token") String token,
        @JsonProperty("movieId") Long movieId,
        @JsonProperty("review") String reviewText,
        @JsonProperty("rating") int rating) {
    
        this.token = token;
        this.reviewText = reviewText;
        this.rating = rating;
        this.movie_id = movieId;
    }
    
    public String getToken() {
        return token;
    }

    public String getReview() {
        return reviewText;
    }

    public Long getMovieId() {
        return movie_id;
    }

    public int getRating() {
        return rating;
    }
}



    
    
