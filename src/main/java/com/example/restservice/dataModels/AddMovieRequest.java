package com.example.restservice.dataModels;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

import com.example.restservice.dataModels.Movie;

public class AddMovieRequest extends Movie {
    
    private String token;

    public AddMovieRequest() {
        super();
    }
    
    public AddMovieRequest(
            @JsonProperty("token") String token,
            @JsonProperty("name") String name,
            @JsonProperty("year") int year,
            @JsonProperty("poster") String poster,
            @JsonProperty("description") String description,
            @JsonProperty("director") String directors,
            @JsonProperty("contentRating") String contentRating,
            @JsonProperty("cast") String cast,
            @JsonProperty("genres") List<String> genres,
            @JsonProperty("trailer") String trailer) {

        super(name, year, poster, description, directors, contentRating, cast, genres, trailer);
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}


