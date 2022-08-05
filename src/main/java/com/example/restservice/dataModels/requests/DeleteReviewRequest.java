package com.example.restservice.dataModels.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class containing all fields for a request from REST API to delete a review
 */
public class DeleteReviewRequest {
    private Long movie_id;
    private Long user_id;
    private String token;

    public DeleteReviewRequest(@JsonProperty("movieId") Long movieId,
                                @JsonProperty("userId") Long userId,
                                @JsonProperty("token") String token) 
    {

        this.movie_id = movieId;
        this.user_id = userId;
        this.token = token;
    }
    public Long getMovieId() {
        return movie_id;
    }

    public Long getUserId() {
        return user_id;
    }

    public String getToken() {
        return token;
    }
    
}
