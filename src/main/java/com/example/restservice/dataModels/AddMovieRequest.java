package com.example.restservice.dataModels;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class AddMovieRequest {
    
    private String token;

    private Movie movie;
    
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

        Movie movie = new Movie(name, year, poster, description, directors, contentRating, cast, genres, trailer);
        this.movie = movie;
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public Movie getMovie() {
        return movie;
    }
}


