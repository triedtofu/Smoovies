package com.example.restservice.service;

import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.restservice.dataModels.Genre;
import com.example.restservice.dataModels.Movie;
import com.example.restservice.dataModels.Review;
import com.example.restservice.dataModels.User;
import com.example.restservice.dataModels.UserBlacklist;
import com.example.restservice.dataModels.UserGenrePreferenceScore;
import com.example.restservice.dataModels.requests.AddReviewRequest;
import com.example.restservice.dataModels.requests.DeleteReviewRequest;
import com.example.restservice.dataModels.requests.LikeReviewRequest;
import com.example.restservice.database.MovieDataAccessService;
import com.example.restservice.database.ReviewDataAccessService;
import com.example.restservice.database.UserBlacklistDataAccessService;
import com.example.restservice.database.UserDataAccessService;
//import com.google.gson.JsonObject;
import com.example.restservice.database.UserGenrePreferenceScoreDataAccessService;

@Service
public class ReviewService {
    @Autowired
    private MovieDataAccessService movieDAO;

    @Autowired
    private UserDataAccessService userDAO;

    @Autowired
    private ReviewDataAccessService reviewDAO;

    @Autowired
    private UserGenrePreferenceScoreDataAccessService userGenrePreferenceScoreDataAccessService;

    @Autowired
    private UserBlacklistDataAccessService userBlacklistDAO;
    /**
     * Adds a user review to a movie.
     * @param addReviewRequest
     * @return
     */
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

        updateUserReviewGenrePreference(movie, user_id, review, true);

        movie.addReviewToMovie(review);
        user.addReviewUser(review);
        movie.recalculateAverageRating();
        userDAO.save(user);
        movieDAO.save(movie);
        reviewDAO.save(review);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
    /**
     * Returns the list of user reviews.
     * @param id
     * @param token
     * @return
     */
    public JSONObject getUserReviews(Long id, String token) {
        HashMap<String, Object> returnMessage = new HashMap<String,Object>();

        User user = userDAO.findUserById(id);

        if (user == null) return ServiceErrors.userIdInvalidError();
        if (user.getIsBanned()) return ServiceErrors.userBannedError();

        //Boolean tokenCheck = ServiceJWTHelper.verifyUserGetRequestToken(token, null);
        //if (!tokenCheck) return ServiceErrors.userTokenInvalidError();
        //The user_id of the authorisation
        returnMessage.put("username", user.getName());
        Set<Review> userReviews = user.getUserReviews();
        //List<Review> listUserReviews = new ArrayList<>(userReviews);
        if (token == null || token.isEmpty()) {
            returnMessage.put("reviews", ServiceHelperFunctions.reviewJSONArray(false, user, userReviews));
        }
        if (token != null && !token.isEmpty()) {
            // check that user is not trying to view a blacklisted users reviews
            List<UserBlacklist> userBlacklist = userBlacklistDAO.findUserBlacklistById(ServiceJWTHelper.getTokenId(token, null));
            for (UserBlacklist blacklist: userBlacklist) {
                if (blacklist.getBlacklistedUserId() == id) return ServiceErrors.cannotViewBlacklistedUser();
            }

            Long user_id = ServiceJWTHelper.getTokenId(token, null);
            if (user_id.equals(id)) {
                returnMessage.put("reviews", ServiceHelperFunctions.reviewJSONArray(true, user, userReviews));
            } else {
                returnMessage.put("reviews", ServiceHelperFunctions.reviewJSONArray(false, user, userReviews));
            }
        }

        //If there is no token or the user_id does not match the id from the token


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

        updateUserReviewGenrePreference(dbMovie, token_user_id, dbreview, false);

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
    /**
     * Delete review from database
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
    /**
     * Likes a review
     * @param request
     * @return
     */
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

    /**
     * Updates the users genre preferences based on their review rating of a movie
     * @param movie
     * @param user_id
     * @param review
     * @param addRemove Boolean value, true for add, false for remove
     */
    private void updateUserReviewGenrePreference(Movie movie, long user_id, Review review, Boolean addRemove) {
        int rating = review.getRating();
        if (!addRemove) {
            rating = -rating;
        }

        Set<Genre> movieGenres = movie.getGenreList();
        for (Genre genre:movieGenres) {
            UserGenrePreferenceScore userGenrePreferenceScore = userGenrePreferenceScoreDataAccessService.findUserPreferenceScoreByGenreId(user_id, genre.getId());
            if (userGenrePreferenceScore != null) {
                userGenrePreferenceScore.updateScore(rating);
            } else {
                userGenrePreferenceScore = new UserGenrePreferenceScore(user_id, genre.getId());
                userGenrePreferenceScore.updateScore(rating);
            }
            userGenrePreferenceScoreDataAccessService.save(userGenrePreferenceScore);
        }
    }

}
