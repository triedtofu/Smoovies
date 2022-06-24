package com.example.restservice.service;

import java.util.List;

import com.example.restservice.dataModels.User;
import com.example.restservice.database.UserDataAccessService;

import com.example.restservice.dataModels.Movie;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import org.json.JSONObject;

import java.util.HashMap;


@Service
public class UserService {
    
    
    @Autowired
	private UserDataAccessService userDAO;

    // receives email and password, check db for valid user
    public JSONObject authenticateUser(User user) {

        // TODO: check user values for errors
        if (!checkEmail(user.getEmail()) || !checkPassword(user.getPassword())) {
            return invalidInputError();
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
            return invalidInputError();
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;

    }

    // receives name, email, password
    public JSONObject addUser(User user, Boolean isAdmin) {

        user.setIsAdmin(isAdmin);

        // TODO: check user values for errors
        if (!checkName(user.getName()) || !checkEmail(user.getEmail()) || !checkPassword(user.getPassword())) {
            return invalidInputError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        try{
            // if user is successfully added, put user in dbUser
            User dbUser = userDAO.save(user);

            // set return response values
            // TODO: Add token implementation
            returnMessage.put("userId", dbUser.getId());
        } catch(IllegalArgumentException e){
            return invalidInputError();
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }


    public List<User> getAllUsers() {
        return userDAO.findAll();
    }

    public JSONObject getMovieDetails(long id) {

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        
        // TODO: Query the database by movie id, need to get actors(cast), genres and reviews as well
        Movie dbMovie = new Movie();
        // TODO: if movie found
        if (dbMovie != null) {
            returnMessage.put("name", dbMovie.getName());
            returnMessage.put("year", dbMovie.getYear());
            returnMessage.put("poster", dbMovie.getPoster());
            returnMessage.put("description", dbMovie.getDescription());
            returnMessage.put("director", dbMovie.getDirector());
            //TODO: add genres
            returnMessage.put("contentRating", dbMovie.getContentRating());
            returnMessage.put("averageRating", dbMovie.getAverageRating());
            //TODO: add cast
            //TODO: add reviews
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;

    }


    public JSONObject searchMovieByName(String name) {

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        // TODO: fix return format (list of objects)

        // TODO: Query the database by movie name, need to get genres as well
        Movie dbMovie = new Movie();
        // TODO: if movie found
        if (dbMovie != null) {
            returnMessage.put("id", dbMovie.getId());
            returnMessage.put("name", dbMovie.getName());
            returnMessage.put("year", dbMovie.getYear());
            returnMessage.put("poster", dbMovie.getPoster());
            returnMessage.put("description", dbMovie.getDescription());
            //TODO: add genres
            returnMessage.put("averageRating", dbMovie.getAverageRating());
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;

    }

    private JSONObject invalidInputError() {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        returnMessage.put("error", "Invalid input");
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    private JSONObject notFoundError() {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        returnMessage.put("error", "Not found");
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }


    // TODO: checks if name is valid format, true = valid
    private Boolean checkName(String name) {
        return true;
    }
    // TODO: checks if email is valid format, true = valid
    private Boolean checkEmail(String email) {
        return true;
    }
    // TODO: checks if password is valid format, true = valid
    private Boolean checkPassword(String Password) {
        return true;
    }
}
