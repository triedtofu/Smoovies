package com.example.restservice.dataModels.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UpdateWishlistRequest {
    private String token;
    private long movieId;
    private Boolean addRemove;

    public UpdateWishlistRequest(@JsonProperty("token") String token,
                                @JsonProperty("movieId") long movieId, 
                                @JsonProperty("turnon") Boolean addRemove) {
        this.token = token;
        this.movieId = movieId;
        this.addRemove = addRemove;
    }


    public String getToken() {
        return token;
    }

    public long getMovieId() {
        return movieId;
    }

    public Boolean getAddRemove() {
        return addRemove;
    }
}
