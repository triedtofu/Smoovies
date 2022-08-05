package com.example.restservice.dataModels;

import java.util.HashSet;
import java.util.Set;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.json.JSONObject;

import com.example.restservice.service.helpers.ServiceErrors;
import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * Entity that represents a review in the database.
 */
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

    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "likedReviews",
        joinColumns = @JoinColumn(name = "review_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> usersliked = new HashSet<>();

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

    public int getLikes() {
        return usersliked.size();
    }

    public JSONObject addLike(User user) {
        if (!usersliked.contains(user)) {
            usersliked.add(user);
            return new JSONObject();
        }
        return ServiceErrors.generateErrorMessage("User has already liked the review");
    }

    public JSONObject removeLike(User user) {
        if (usersliked.contains(user)) {
            usersliked.remove(user);
            return new JSONObject();
        }
        return ServiceErrors.generateErrorMessage("User has not liked the review");
    }

    public boolean checkUserLikedReview(User user) {
        if(usersliked.contains(user)) return true;
        return false;
    }

}
