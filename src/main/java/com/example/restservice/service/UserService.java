package com.example.restservice.service;

import java.util.List;
import java.util.UUID;

import com.example.restservice.dataModels.User;
import com.example.restservice.database.UserDataAccessService;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.beans.factory.annotation.Qualifier;
import org.json.JSONObject;

import java.util.HashMap;


@Service
public class UserService {
    
    
    @Autowired
	private UserDataAccessService userDAO;

    /* 
    public JSONObject authenticateUser(User user) {

        // // TODO: check user values for errors
        // if () {
        //     return invalidInputError();
        // }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        // find the user in the database
        User dbUser = userDAO.getUserByEmailPassword(user.getEmail(), user.getPassword());
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
    */
    /*
     * Register a user by adding their details to the database.
     */
    public JSONObject addUser(User user) {
        // generate random ID for now
        // // TODO: check user values for errors
        // if () {
        //     return invalidInputError();
        // }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        boolean success = this.helperAddUser(user);
        // if user is added, return details
        if (success) {
            returnMessage.put("userId", user.getId());
        }
        // otherwise return error
        else {
            return invalidInputError();
        }
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    /*
     * Helper function to add a user -- abstract into a new folder 
     */
    public boolean helperAddUser(User user) {
        if (userDAO.save(user) != null) {
            return true;
        }
        return false;
    }


    public List<User> getAllUsers() {
        return userDAO.findAll();
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
}
