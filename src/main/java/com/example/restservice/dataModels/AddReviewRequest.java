package com.example.restservice.dataModels;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AddReviewRequest extends Review{

    private String token;
    
    public AddReviewRequest(
        @JsonProperty("token") String token,
        @JsonProperty("movieId") int movieId,
        @JsonProperty("review") String review,
        @JsonProperty("rating") int rating) {
    
        super(movieId, review, rating);
        this.token = token;
    }
    
    public String getToken() {
        return token;
    }
}



    
    
