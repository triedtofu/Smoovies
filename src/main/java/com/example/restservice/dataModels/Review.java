package com.example.restservice.dataModels;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.CascadeType;
import javax.persistence.Column;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @Column(name = "review")
    private  String review;

    @Column(name = "rating")
    private int rating;

    public Review() {
        super();
    }

    public Review(Movie movie, User user, String review, int rating) {
        super();
        this.user = user;
        this.movie = movie;
        this.review = review;
        this.rating = rating;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getReviewString() {
        return review;
    }

    public Movie getMovie() {
        return movie;
    }

    public int getRating() {
        return rating;
    }

    public User getUser() {
        return user;
    }

}
