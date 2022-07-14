package com.example.restservice.dataModels;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "userId")
    private  long userId;
    
    @Column(name = "movieId")
    private  long movieId;  

    @Column(name = "review")
    private  String review;

    @Column(name = "rating")
    private int rating;

    public Review() {
        super();
    }

    public Review(
                @JsonProperty("movieId") int movieId,
                @JsonProperty("review") String review,
                @JsonProperty("rating") int rating) {
        super();
        this.movieId = movieId;
        this.review = review;
        this.rating = rating;
    }

    public long getId() {
        return id;
    }

    public long getUserId() {
        return userId;
    }

    public long getMovieId() {
        return movieId;
    }

    public String getReview() {
        return review;
    }

    public int getRating() {
        return rating;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }
}
