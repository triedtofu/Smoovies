package com.example.restservice.service;

import java.util.List;
import java.util.ArrayList;

import com.example.restservice.dataModels.User;
import com.example.restservice.database.UserDataAccessService;
import com.example.restservice.database.MovieDataAccessService;

import com.example.restservice.dataModels.Movie;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import org.json.JSONObject;
import org.json.JSONArray;

import java.util.HashMap;
import com.example.restservice.service.ServiceErrors;
import com.example.restservice.service.ServiceInputChecks;
@Service
public class UserService {
    
    
    @Autowired
	private UserDataAccessService userDAO;

    /**
     * Authenticates user when trying to login
     * @param user
     * @return token, userId, isAdmin
     */
    public JSONObject authenticateUser(User user) {

        // TODO: check user values for errors
        if (!ServiceInputChecks.checkEmail(user.getEmail()) || !ServiceInputChecks.checkPassword(user.getPassword())) {
            return ServiceErrors.invalidInputError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        // TODO: Query the database by email to find a matching user, put user in "dbUser"
        User dbUser = user;
        // TODO: if user found
        if (dbUser != null) {
            // TODO: Add token implementation
            returnMessage.put("userId", dbUser.getId());
            returnMessage.put("isAdmin", dbUser.getIsAdmin());
        }
        // otherwise return error
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
    public JSONObject addUser(User user, Boolean isAdmin) {

        // TODO: check user values for errors
        if (!ServiceInputChecks.checkName(user.getName()) || !ServiceInputChecks.checkEmail(user.getEmail()) || !ServiceInputChecks.checkPassword(user.getPassword())) {
            return ServiceErrors.invalidInputError();
        }

        user.setIsAdmin(isAdmin);

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        try{
            // if user is successfully added, put user in dbUser
            User dbUser = userDAO.save(user);

            // set return response values
            // TODO: Add token implementation
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
                dbMovieDetails.put("averageRating", dbMovie.getAverageRating());

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

}
