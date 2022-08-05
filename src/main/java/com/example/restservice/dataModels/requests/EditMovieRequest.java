package com.example.restservice.dataModels.requests;

import com.example.restservice.dataModels.Movie;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Class containing all fields for a request from REST API to edit a movie
 */
public class EditMovieRequest {

    private String token;
    private long movieId;
    private Movie movie;
    
    public EditMovieRequest(
            @JsonProperty("token") String token,
            @JsonProperty("id") long movieId,
            @JsonProperty("name") String name,
            @JsonProperty("year") int year,
            @JsonProperty("poster") String poster,
            @JsonProperty("description") String description,
            @JsonProperty("director") String directors,
            @JsonProperty("contentRating") String contentRating,
            @JsonProperty("cast") String cast,
            @JsonProperty("genres") List<String> genres,
            @JsonProperty("trailer") String trailer,
            @JsonProperty("runtime") int runtime) {

        Movie movie = new Movie(name, year, poster, description, directors, contentRating, cast, genres, trailer, runtime);
        this.token = token;
        this.movieId = movieId;
        this.movie = movie;
    }

    public String getToken() {
        return token;
    }

    public long getMovieId() {
        return movieId;
    }

    public Movie getMovie() {
        return movie;
    }
}
