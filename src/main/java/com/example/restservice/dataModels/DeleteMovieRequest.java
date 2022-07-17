package com.example.restservice.dataModels;

import com.fasterxml.jackson.annotation.JsonProperty;

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
