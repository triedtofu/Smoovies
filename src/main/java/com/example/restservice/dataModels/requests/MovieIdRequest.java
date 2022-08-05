package com.example.restservice.dataModels.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class containing all fields for a request from REST API to get a movie
 */
public class MovieIdRequest {
    private long movieId;

    public MovieIdRequest(@JsonProperty("movieId") long movieId) {
        this.movieId = movieId;
    }


    public long getMovieId() {
        return movieId;
    }

}
