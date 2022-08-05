package com.example.restservice.dataModels.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class containing all fields for a request from REST API to search for a movie
 */
public class SearchRequest {
    private String name;
    private String genres;
    private String contentRating;

    public SearchRequest(@JsonProperty("name") String name, @JsonProperty("genres") String genres,
    @JsonProperty("contentRating") String contentRating) {
        this.name = name;
        this.genres = genres;
        this.contentRating = contentRating;
    }

    public String getName() {
        return name;
    }

    public String getGenres() {
        return genres;
    }

    public String getContentRating() {
        return contentRating;
    }
}
