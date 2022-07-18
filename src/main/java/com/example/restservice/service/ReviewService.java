package com.example.restservice.service;

import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.restservice.dataModels.AddReviewRequest;
import com.example.restservice.dataModels.Movie;
import com.example.restservice.dataModels.Review;
import com.example.restservice.dataModels.User;
import com.example.restservice.database.MovieDataAccessService;
import com.example.restservice.database.ReviewDataAccessService;
import com.example.restservice.database.UserDataAccessService;

@Service
public class ReviewService {
    @Autowired
    private MovieDataAccessService movieDAO;

    @Autowired
    private UserDataAccessService userDAO;

    @Autowired
    private ReviewDataAccessService reviewDAO;

    public JSONObject addReview(AddReviewRequest addReviewRequest) {
        // split the request into its parts
        String token = addReviewRequest.getToken();

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();


        // check valid inputs
        // check movieId exists/is valid
        Movie movie = movieDAO.findMovieByID(addReviewRequest.getMovieId());
        if (movie == null) {
            return ServiceErrors.movieNotFoundError();
        }
        // verify the token and extract the users id
        Long user_id = ServiceJWTHelper.getTokenId(token, null);
        if (user_id == null) {
            return ServiceErrors.userTokenInvalidError();
        }

        User user = userDAO.findUserById(user_id);

        
        
        if (user == null) {
            return ServiceErrors.userIdInvalidError();
        }

        Review dbReview = reviewDAO.findReview(movie.getId(), user.getId());

        if (dbReview != null) return ServiceErrors.reviewAlreadyExistsError();

        Review review = new Review(movie, user, addReviewRequest.getReview(), addReviewRequest.getRating());
        
        movie.addReviewToMovie(review);
        user.addReviewUser(review);
        userDAO.save(user);
        movieDAO.save(movie);
        reviewDAO.save(review);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    public JSONObject getUserReviews(Long id) {
        HashMap<String, Object> returnMessage = new HashMap<String,Object>();
        
        User user = userDAO.findUserById(id);
        if (user == null) {return ServiceErrors.userIdInvalidError();}
        returnMessage.put("username", user.getName());

        //Loop through their reviews.
        JSONArray reviewArray = new JSONArray();

        for (Review review : user.getUserReviews()) {
            HashMap<String, Object> userReview = new HashMap<String,Object>();
            userReview.put("movieId", review.getMovie().getId());
            userReview.put("movieName", review.getMovie().getName());
            userReview.put("review", review.getReviewString());
            userReview.put("rating", review.getRating());
            JSONObject userReviewJson = new JSONObject(userReview);
            reviewArray.put(userReviewJson);
        }
        returnMessage.put("reviews", reviewArray);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
}
