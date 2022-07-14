package com.example.restservice.dataModels;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AddReviewRequest {

    private String token;

    private Review review;
    
    public AddReviewRequest(
        @JsonProperty("token") String token,
        @JsonProperty("movieId") int movieId,
        @JsonProperty("review") String reviewText,
        @JsonProperty("rating") int rating) {
    
        Review review = new Review(movieId, reviewText, rating);
        this.review = review;
        this.token = token;
    }
    
    public String getToken() {
        return token;
    }

    public Review getReview() {
        return review;
    }
}



    
    
