package com.example.restservice.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

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
        List<Review> reviewsToCalculate = getMovieReviewsByUserToken(userBlacklistDAO, movie, token);
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

    public static List<Review> getMovieReviewsByUserToken(UserBlacklistDataAccessService userBlacklistDAO, Movie movie, String token) {
        
        // case where token is not passed in (since token is optional in some api calls)
        // can be simulated by user not logged in 
        if(token == null) {
            List<Review> reviews = new ArrayList<Review>(movie.getMovieReviews());
            Collections.sort(reviews, new Comparator<Review>() {
                public int compare(Review r1, Review r2) {
                    return r2.getLikes() - r1.getLikes();
                }
            });
            return reviews;
        }

        List<Review> validMovieReviews = new ArrayList<Review>();

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
        Collections.sort(validMovieReviews, new Comparator<Review>() {
            public int compare(Review r1, Review r2) {
                return r2.getLikes() - r1.getLikes();
            }
        });
        return validMovieReviews;
    }

}
