package com.example.restservice.service;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.example.restservice.dataModels.Movie;
import com.example.restservice.dataModels.Review;
import com.example.restservice.dataModels.User;
import com.example.restservice.database.UserBlacklistDataAccessService;

public class JSONObjectGenerators {
    /**
     * Generates a movie object JSON representation
     * Note similar movies are not part of the movie object, and is done seperately in the service function
     * @param requiredFields fields the movieObject needs
     * @param movie the movie that needs the JSON representation
     * @param userBlacklistDAO used for averageRating
     * @param token The optional token parameter, used for average rating
     * @param user The user that is making the request.
     * @return
     */
    public static JSONObject movieObject(String requiredFields, Movie movie, UserBlacklistDataAccessService userBlacklistDAO, String token, User user) {
        HashMap<String, Object> returnMovie = new HashMap<>();
        List<String> required = new ArrayList<>(Arrays.asList(requiredFields.split(",[ ]*")));
        for (String field : required) {
            switch(field) {
                case "id":
                returnMovie.put("id", movie.getId());
                break;
                case "name" : 
                returnMovie.put("name", movie.getName());
                break;
                case "year" :
                returnMovie.put("year", movie.getYear());
                break;
                case "poster" :
                returnMovie.put("poster", movie.getPoster());
                break;
                case "trailer" :
                returnMovie.put("trailer", movie.getTrailer());
                break;
                case "description" :
                returnMovie.put("description", movie.getDescription());
                break;
                case "director" :
                returnMovie.put("director", movie.getDirectors());
                break;
                case "contentRating" :
                returnMovie.put("contentRating", movie.getContentRating());
                break;
                case "runtime" :
                returnMovie.put("cast", movie.getRuntime());
                break;
                case "genres" :
                returnMovie.put("genres", new JSONArray(movie.getGenreListStr()));
                break;
                case "reviews" :
                List<Review> reviewList = ServiceGetRequestHelperFunctions.getMovieReviewsByUserToken(userBlacklistDAO, movie, token);
                String requiredReviewFields;
                if (token == null) {
                     requiredReviewFields = "user, name, review, rating, likes";
                } else {
                    requiredReviewFields = "user, name, review, rating, likes, liked";
                }
                JSONArray reviewArray = new JSONArray();
                for (Review review : reviewList) {
                    reviewArray.put(reviewObject(requiredReviewFields, review, user));
                }
                break;
                case "averageRating" :
                returnMovie.put("averageRating", ServiceGetRequestHelperFunctions.getMovieAverageRatingByUserToken(userBlacklistDAO, movie, token));
                break;
            }
        }
        return new JSONObject(returnMovie);
    }
    
    public static JSONObject reviewObject(String requiredFields, Review review, User user) {
        HashMap<String,Object> returnReview = new HashMap<>();
        List<String> required = new ArrayList<>(Arrays.asList(requiredFields.split(",[ ]*")));
        for (String field : required) {
            switch(field) {
                case "user" :
                returnReview.put("user", review.getUser().getId());
                break;
                case "name" :
                returnReview.put("name", review.getUser().getName());
                break;
                case "review" :
                returnReview.put("review", review.getReviewString());
                break;
                case "rating" :
                returnReview.put("rating", review.getRating());
                break;
                case "likes" :
                returnReview.put("likes", review.getLikes());
                break;
                case "liked" :
                if (review.checkUserLikedReview(user)) {
                    returnReview.put("liked", true);
                } else {
                    returnReview.put("liked", false);
                }
                break;
                case "movieId" :
                returnReview.put("movieId", review.getMovie().getId());
                break;
                case "movieName" :
                returnReview.put("movieName", review.getMovie().getName());
                break;
                case "poster" :
                returnReview.put("poster", review.getMovie().getPoster());
            } 
        }
        return new JSONObject(returnReview);
    }
    
}
