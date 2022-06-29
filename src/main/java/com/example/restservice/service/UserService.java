package com.example.restservice.service;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;

import com.example.restservice.dataModels.User;
import com.example.restservice.dataModels.AuthenticationToken;
import com.example.restservice.dataModels.Movie;

import com.example.restservice.database.UserDataAccessService;
import com.example.restservice.database.MovieDataAccessService;

import com.example.restservice.service.ServiceErrors;
import com.example.restservice.service.ServiceInputChecks;
import com.example.restservice.service.ServiceJWTHelper;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import org.json.JSONObject;
import org.json.JSONArray;

import java.util.HashMap;
import com.example.restservice.service.ServiceErrors;
import com.example.restservice.service.ServiceInputChecks;
import com.fasterxml.jackson.annotation.JsonProperty;


@Service
public class UserService {
    
    
    @Autowired
	private UserDataAccessService userDAO;
  
    /**
     * Logs a user in based on their email and password.
     * @param email
     * @param password
     * @return userID, isAdmin, token
     */
    public JSONObject UserLogin(String email, String password) {

        // TODO: check user values for errors
        if (!ServiceInputChecks.checkEmail(email) || !ServiceInputChecks.checkPassword(password)) {
            return ServiceErrors.invalidInputError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        User user = userDAO.findUserByEmail(email);
        //Password verification step
        if (!password.equals(user.getPassword())) {
            return ServiceErrors.invalidInputError();
        }

        if (user != null) {
            returnMessage.put("token", ServiceJWTHelper.generateJWT(user.getId().toString(), user.getEmail()));
            returnMessage.put("userId", user.getId());
            returnMessage.put("isAdmin", user.getIsAdmin());
            //returnMessage.put("token", user.getToken());
        }
        // otherwise return error (SHOULD THIS BE A DIFFERENT ERROR?)
        else {
            return ServiceErrors.invalidInputError();
        }
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    /**
     * Adds user to database
     * @param user
     * @param isAdmin
     * @return token, userID
     */
    public JSONObject register(User user, Boolean isAdmin) {

        // TODO: check user values for errors
        if (!ServiceInputChecks.checkName(user.getName()) || 
            !ServiceInputChecks.checkEmail(user.getEmail()) || 
            !ServiceInputChecks.checkPassword(user.getPassword()) ||
            !ServiceInputChecks.checkUniqueEmail(user.getEmail())) {
            return ServiceErrors.invalidInputError();
        }
        
        user.setIsAdmin(isAdmin);
        
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        try{
            // if user is successfully added, put user in dbUser
            // set return response values
            User dbUser = userDAO.save(user);
            // TODO: Add token implementation
            returnMessage.put("token", ServiceJWTHelper.generateJWT(user.getId().toString(), user.getEmail()));
            returnMessage.put("userId", dbUser.getId());
        } catch(IllegalArgumentException e){
            return ServiceErrors.invalidInputError();
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    /**
     * Get list of all users from database
     * @return list of users
     */
    public List<User> getAllUsers() {
        return userDAO.findAll();
    }

    /**
     * Grabs the wishlist of a user
     * @param id
     * @return wishlist of user
     */
    public JSONObject getUserWishlist(long id) {

        // TODO: check id for errors
        if (!ServiceInputChecks.checkId(id)) {
            return ServiceErrors.invalidInputError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        // stores array of movies that are found by the search
        JSONArray moviesArray = new JSONArray();

        // TODO: Query the database for the movies in the users wishlist
        List<Movie> dbMovies = new ArrayList<Movie>();
        // TODO: if valid movies are found (list of movies is larger than size 0)
        if (dbMovies.size() > 0) {
            for(int i = 0; i < dbMovies.size(); i++) {
                Movie dbMovie = dbMovies.get(i);
                HashMap<String,Object> dbMovieDetails = new HashMap<String,Object>();
                dbMovieDetails.put("id", dbMovie.getId());
                dbMovieDetails.put("name", dbMovie.getName());
                dbMovieDetails.put("year", dbMovie.getYear());
                dbMovieDetails.put("poster", dbMovie.getPoster());
                dbMovieDetails.put("description", dbMovie.getDescription());
                //TODO: add genres
                JSONObject dbMovieDetailsJson = new JSONObject(dbMovieDetails);
                moviesArray.put(dbMovieDetailsJson);
            }
        } 
        // otherwise if no movies found, return not found error
        else {
            return ServiceErrors.notFoundError();
        }

        returnMessage.put("movies", moviesArray);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;

    }

    /**
     * Updates the wishlist of a user
     * @param token
     * @param movieId 
     * @param addRemove
     * @return {}
     */
    public JSONObject updateUserWishlist(AuthenticationToken token, long movieId, Boolean addRemove) {

        // TODO: check inputs for errors
        if (!ServiceInputChecks.checkId(movieId)) {
            return ServiceErrors.invalidInputError();
        }

        // verify the token and extract the users email
        String userEmail = ServiceJWTHelper.verifyJWT(token.getToken());
        if (userEmail == null) {
            return ServiceErrors.invalidTokenError();
        }

        // TODO: add/remove movie from wishlist
        // you have the users email, query db for their wishlisht
        // if addRemove == true
        if (addRemove) {    
            // TODO: add movie to wishlist

        }
        // if addRemove == false
        else {
            //TODO: remove from wishlist

        }

        JSONObject responseJson = new JSONObject();
        return responseJson;

    }

}
