package com.example.restservice.dataModels.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MovieIdRequest {
    private long movieId;

    public MovieIdRequest(@JsonProperty("movieId") long movieId) {
        this.movieId = movieId;
    }


    public long getMovieId() {
        return movieId;
    }

}
