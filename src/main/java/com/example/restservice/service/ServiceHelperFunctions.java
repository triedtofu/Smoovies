package com.example.restservice.service;

import java.util.HashMap;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

import com.example.restservice.dataModels.Review;
import com.example.restservice.dataModels.User;

public class ServiceHelperFunctions {
    
    /**
     * Returns the JSONArray for a users reviews containing all fields
     * @param needLiked the reviews need the liked field, when the token matches the id given
     * @param user The Authorised user, to check if they have liked the review.
     * @return
     */
    public static JSONArray reviewJSONArray(Boolean needLiked, User user, Set<Review> reviews) {
        JSONArray reviewJSONArray = new JSONArray();
        for (Review review : reviews) {
            if (review.getUser().getIsBanned()) continue;
            HashMap<String, Object> userReview = new HashMap<String,Object>();
            userReview.put("movieId", review.getMovie().getId());
            userReview.put("movieName", review.getMovie().getName());
            userReview.put("poster", review.getMovie().getPoster());
            userReview.put("review", review.getReviewString());
            userReview.put("rating", review.getRating());
            userReview.put("likes", review.getLikes());
            if (needLiked) {
                if (review.checkUserLikedReview(user)) {
                    userReview.put("liked", true);
                } else {
                    userReview.put("liked", false);
                }
            }
            reviewJSONArray.put(new JSONObject(userReview));
        }
        return reviewJSONArray;
    }

    
}
