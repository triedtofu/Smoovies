package com.example.restservice.dataModels.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class containing all fields for a request from REST API to delete a movie
 */
public class DeleteMovieRequest {
    private String token;
    private long movieId;

    public DeleteMovieRequest(@JsonProperty("token") String token,
                            @JsonProperty("movieId") long movieId) 
    {
        this.token = token;
        this.movieId = movieId;
    
    }

    public String getToken() {
        return token;
    }

    public long getMovieId() {
        return this.movieId;    
    }
}
