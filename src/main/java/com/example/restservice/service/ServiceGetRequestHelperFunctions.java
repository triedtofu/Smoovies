package com.example.restservice.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


import com.example.restservice.dataModels.Movie;
import com.example.restservice.dataModels.Review;
import com.example.restservice.dataModels.UserBlacklist;
import com.example.restservice.database.UserBlacklistDataAccessService;



public class ServiceGetRequestHelperFunctions {

    public static double getMovieAverageRatingByUserToken(UserBlacklistDataAccessService userBlacklistDAO, Movie movie, String token) {
        
        // case where token is not passed in (since token is optional in some api calls)
        // can be simulated by user not logged in 
        if(token == null) {
            return movie.getAverageRating();
        }

        double total = 0;
        Set<Review> reviewsToCalculate = getMovieReviewsByUserToken(userBlacklistDAO, movie, token);
        BigDecimal averageRating;

        if (reviewsToCalculate.size() == 0) {
            averageRating = new BigDecimal(0.0);
        } else {
            for (Review review : reviewsToCalculate) {
                total = total + review.getRating();
            }
            
            averageRating = new BigDecimal(total/reviewsToCalculate.size());
        }
        
        // round to 1dp
        return (double)Math.round(averageRating.doubleValue() * 10d) / 10d;
    }

    public static Set<Review> getMovieReviewsByUserToken(UserBlacklistDataAccessService userBlacklistDAO, Movie movie, String token) {
        
        // case where token is not passed in (since token is optional in some api calls)
        // can be simulated by user not logged in 
        if(token == null) {
            return movie.getMovieReviews();
        }

        Set<Review> validMovieReviews = new HashSet<>();

        List<UserBlacklist> userBlacklist = userBlacklistDAO.findUserBlacklistById(ServiceJWTHelper.getTokenId(token, null));

        for(Review review : movie.getMovieReviews()) {
            boolean validReviewCheck = true;
            for(UserBlacklist blacklist: userBlacklist) {
                if (review.getUser().getId() == blacklist.getBlacklistedUserId()) {
                    validReviewCheck = false;
                    break;
                }
            }
            if (validReviewCheck) {
                validMovieReviews.add(review);
            }
        }
        return validMovieReviews;
    }
}
