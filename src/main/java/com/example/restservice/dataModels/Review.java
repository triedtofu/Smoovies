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
    private  int userId;
    
    @Column(name = "review")
    private  String review;

    @Column(name = "rating")
    private int rating;

    public Review() {
        super();
    }

    public Review(
                @JsonProperty("userId") int userId,
                @JsonProperty("review") String review,
                @JsonProperty("rating") int rating) {
        super();
        this.userId = userId;
        this.review = review;
        this.rating = rating;
    }

    public long getId() {
        return id;
    }

    public String getReview() {
        return review;
    }

    public int getRating() {
        return rating;
    }
}
