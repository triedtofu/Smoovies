package com.example.restservice.service;

import java.util.List;
import java.util.UUID;

import com.example.restservice.dataModels.User;
import com.example.restservice.database.UserDAO;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.json.JSONObject;

import java.util.HashMap;

@Service
public class UserService {
    
    private final UserDAO userDAO;

    @Autowired
    public UserService(@Qualifier("TestUserDAO") UserDAO userDAO) {
        this.userDAO = userDAO;
    }

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

    public JSONObject addUser(User user) {
        // generate random ID for now
        UUID id = UUID.randomUUID();

        // // TODO: check user values for errors
        // if () {
        //     return invalidInputError();
        // }


        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        // if user is added, return details
        if (userDAO.addUser(user, id) == 1) {
            // TODO: Add token implementation
            returnMessage.put("userId", id);
        }
        // otherwise return error
        else {
            return invalidInputError();
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;

    }

    public List<User> getAllUsers() {
        return userDAO.getAllUsers();
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
