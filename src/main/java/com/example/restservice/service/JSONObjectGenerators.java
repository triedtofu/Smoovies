package com.example.restservice.service;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.example.restservice.dataModels.Actor;
import com.example.restservice.dataModels.Director;
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
                returnMovie.put("cast", movie.getCast());
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
                break;
            } 
        }
        return new JSONObject(returnReview);
    }

    public static JSONObject actorObject(String requiredFields, Actor actor, UserBlacklistDataAccessService userBlacklistDAO){
        HashMap<String, Object> returnActor = new HashMap<>();
        List<String> required = new ArrayList<>(Arrays.asList(requiredFields.split(",[ ]*")));
        for (String field : required) {
            switch(field) {
                case "name" :
                returnActor.put("name", actor.getName());
                break;
                case "id" :
                returnActor.put("id", actor.getId());
                break;
                case "movies" :
                JSONArray movieArray = new JSONArray();
                String requiredMovieFields = "id, name, year, poster, description, genres, averageRating";
                for (Movie movie : actor.getMovieActorsIn()) {
                    movieArray.put(movieObject(requiredMovieFields, movie, userBlacklistDAO, null, null));
                }
                returnActor.put("movies", movieArray);
                break;
            }
        }
        return new JSONObject(returnActor);
    }
    /**
     * Generates a director JSON object based on required fields.
     * @param requiredFields
     * @param director
     * @param userBlacklistDAO
     * @return
     */
    public static JSONObject directorObject(String requiredFields, Director director, UserBlacklistDataAccessService userBlacklistDAO){
        HashMap<String, Object> returnDirector = new HashMap<>();
        List<String> required = new ArrayList<>(Arrays.asList(requiredFields.split(",[ ]*")));
        for (String field : required) {
            switch(field) {
                case "name" :
                returnDirector.put("name", director.getName());
                break;
                case "id" :
                returnDirector.put("id", director.getId());
                break;
                case "movies" :
                JSONArray movieArray = new JSONArray();
                String requiredMovieFields = "id, name, year, poster, description, genres, averageRating";
                for (Movie movie : director.getDirectorIsIn()) {
                    movieArray.put(movieObject(requiredMovieFields, movie, userBlacklistDAO, null, null));
                }
                returnDirector.put("movies", movieArray);
                break;
            }
        }
        return new JSONObject(returnDirector);
    }
    /**
     * Generates a user JSON representation based on the required fields.
     * @param requiredFields
     * @param user
     * @return
     */
    public static JSONObject userObject(String requiredFields, User user) {
        HashMap<String,Object> returnUser = new HashMap<>();
        List<String> required = new ArrayList<>(Arrays.asList(requiredFields.split(",[ ]*")));
        for (String field : required) {
            switch(field) {
                case "token" :
                returnUser.put("token" , ServiceJWTHelper.generateJWT(user.getId().toString(), user.getEmail(), null) );
                break;
                case "userId" :
                returnUser.put("userId", user.getId());
                break;
                case "isAdmin" :
                returnUser.put("isAdmin", user.getIsAdmin());
                break;
                case "name" :
                returnUser.put("name", user.getName());
                break;
                case "username" :
                returnUser.put("username", user.getName());
                break;
                case "email" :
                returnUser.put("email", user.getEmail());
            }
        }
        return new JSONObject(returnUser);
    }
}
