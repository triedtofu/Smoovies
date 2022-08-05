package com.example.restservice.dataModels.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class containing all fields for a request from REST API to like a review
 */
public class LikeReviewRequest {
    private String token;
    private long movieId;
    private long userId;
    private boolean turnon;

    public LikeReviewRequest(@JsonProperty("token") String token,
                            @JsonProperty("movieId") Long movieId,
                            @JsonProperty("userId") Long userId,
                            @JsonProperty("turnon") boolean turnon) 
    {
        this.token = token;
        this.movieId = movieId;
        this.userId = userId;
        this.turnon = turnon;
    }

    public Long getMovieId() {
        return movieId;
    }

    public Long getUserId() {
        return userId;
    }

    public boolean getTurnOn() {
        return turnon;
    }

    public String getToken() {
        return token;
    }
}
