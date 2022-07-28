package com.example.restservice.service;

import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.restservice.dataModels.Movie;
import com.example.restservice.dataModels.Review;
import com.example.restservice.dataModels.User;
import com.example.restservice.dataModels.requests.AddReviewRequest;
import com.example.restservice.dataModels.requests.DeleteReviewRequest;
import com.example.restservice.dataModels.requests.LikeReviewRequest;
import com.example.restservice.database.MovieDataAccessService;
import com.example.restservice.database.ReviewDataAccessService;
import com.example.restservice.database.UserDataAccessService;
//import com.google.gson.JsonObject;

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

        if (user == null) return ServiceErrors.userIdInvalidError();

        // check the user is not banned
        if (user.getIsBanned()) return ServiceErrors.userBannedError();

        Review dbReview = reviewDAO.findReview(movie.getId(), user.getId());

        if (dbReview != null) return ServiceErrors.reviewAlreadyExistsError();

        Review review = new Review(movie, user, addReviewRequest.getReview(), addReviewRequest.getRating());
        movie.addReviewToMovie(review);
        user.addReviewUser(review);
        movie.recalculateAverageRating();
        userDAO.save(user);
        movieDAO.save(movie);
        reviewDAO.save(review);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    public JSONObject getUserReviews(Long id) {
        HashMap<String, Object> returnMessage = new HashMap<String,Object>();

        User user = userDAO.findUserById(id);
        if (user == null) return ServiceErrors.userIdInvalidError();
        if (user.getIsBanned()) return ServiceErrors.userBannedError();

        returnMessage.put("username", user.getName());

        //Loop through their reviews.
        JSONArray reviewArray = new JSONArray();

        for (Review review : user.getUserReviews()) {
            HashMap<String, Object> userReview = new HashMap<String,Object>();
            userReview.put("movieId", review.getMovie().getId());
            userReview.put("movieName", review.getMovie().getName());
            userReview.put("poster", review.getMovie().getPoster());
            userReview.put("review", review.getReviewString());
            userReview.put("rating", review.getRating());
            userReview.put("likes", review.getLikes());
            JSONObject userReviewJson = new JSONObject(userReview);
            reviewArray.put(userReviewJson);
        }
        returnMessage.put("reviews", reviewArray);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
    /**
     * Check for:
     * If review exists, if user exists, if movie exists, if user_id matches the token.
     * @param deleteReviewRequest
     * @return
     */
    public JSONObject deleteReview (DeleteReviewRequest deleteReviewRequest) {
        HashMap<String, Object> returnMessage = new HashMap<String,Object>();
        //Token -- user submitting the request, user_id is for identification of the review;
        String token = deleteReviewRequest.getToken();
        Long token_user_id = ServiceJWTHelper.getTokenId(token, null);


        Movie dbMovie = movieDAO.findMovieByID(deleteReviewRequest.getMovieId());
        if (dbMovie == null) return ServiceErrors.movieNotFoundError();

        Review dbreview = reviewDAO.findReview(deleteReviewRequest.getMovieId(), deleteReviewRequest.getUserId());
        if (dbreview == null) return ServiceErrors.reviewNotFound();

        User dbRequestUser = userDAO.findUserById(token_user_id);
        if (token_user_id == null) return ServiceErrors.userNotFoundFromTokenIdError();

        User dbReviewUser = userDAO.findUserById(deleteReviewRequest.getUserId());
        if (dbReviewUser.getIsBanned()) return ServiceErrors.userBannedError();

        if (dbRequestUser.getIsAdmin()) {
            //If is admin, can delete any review.
            deleteReviewFromDatabase(dbMovie, dbReviewUser, dbreview);
        } else {
            //Check that the user_id from the review match the user_id of the token.
            if (dbRequestUser.getId() != dbReviewUser.getId()) return ServiceErrors.wrongOwnershipReviewError();
            deleteReviewFromDatabase(dbMovie, dbReviewUser, dbreview);
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
    /**
     *
     * @param movie The movie in the review;
     * @param user The user who wrote the review;
     * @param review
     */
    private void deleteReviewFromDatabase(Movie movie, User user, Review review) {
        user.removeUserReview(review);
        movie.removeMovieReview(review);
        movie.recalculateAverageRating();
        movieDAO.save(movie);
        userDAO.save(user);
        reviewDAO.delete(review);
    }

    public JSONObject likeReview(LikeReviewRequest request) {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        JSONObject errorMessage = reviewErrorChecks(request.getMovieId(), request.getToken(), request.getUserId());
        if (errorMessage.length() != 0) return errorMessage;

        User user = userDAO.findUserById(ServiceJWTHelper.getTokenId(request.getToken(), null));

        Review review = reviewDAO.findReview(request.getMovieId(), request.getUserId());

        JSONObject responseFromLike = new JSONObject();
        if (request.getTurnOn()) {
            responseFromLike = review.addLike(user);
        } else {
            responseFromLike = review.removeLike(user);
        }
        reviewDAO.save(review);
        
        if (responseFromLike.length() != 0) return responseFromLike;
        return new JSONObject(returnMessage);
    }
    
    /**
     * Checks the movie on the review indentifier exists
     * Checks the review exists from the given user and review
     * Checks if the requestUser (Token bearer) exists
     * Checks if the requestUser is banned
     * 
     * @param movieId The movie of the review
     * @param token The token of the requester
     * @param userId The userId of the review
     * @return
     */
    private JSONObject reviewErrorChecks(Long movieId, String token, Long userId) {
        Movie dbMovie = movieDAO.findMovieByID(movieId);
        if (dbMovie == null) return ServiceErrors.movieNotFoundError();
        
        Long token_user_id = ServiceJWTHelper.getTokenId(token, null);
        if (token_user_id == null) return ServiceErrors.userNotFoundFromTokenIdError();
        User dbRequestUser = userDAO.findUserById(token_user_id);
        if (dbRequestUser == null) return ServiceErrors.userNotFound();
        if (dbRequestUser.getIsBanned()) return ServiceErrors.userBannedError();
        
        Review dbreview = reviewDAO.findReview(movieId, userId);
        if (dbreview == null) return ServiceErrors.reviewNotFound();

        return new JSONObject();

        
    }
}
