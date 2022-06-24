package com.example.restservice.api;

import com.example.restservice.dataModels.User;
import com.example.restservice.service.UserService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.json.JSONObject;

import java.util.List;

//Expose endpoints so clients can consume 
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public Object authenticateUser(@RequestBody User user) {
        JSONObject response = userService.authenticateUser(user);

        if(response.has("error")){
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
        }
    }


    @PostMapping("/register")
    public ResponseEntity<Object> addUser(@RequestBody User user) {

        // admin accounts are created in backend, if calling this api, assume it is from frontend (therefore admin = false)
        JSONObject response = userService.addUser(user, false);

        if(response.has("error")){
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
        }

    }

    
    @GetMapping("/getAllUsers")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }


    @GetMapping("/movie")
    public Object getMovieDetails(long id) {
        JSONObject response = userService.getMovieDetails(id);

        // TODO: test the error codes work
        if(response.has("error")){
            String error = response.getString("error");
            if (error.equals("Invalid input")) {
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            } else {
                return new ResponseEntity<Object>(response.toString(), HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
        }
    }

    @GetMapping("/movie/search")
    public Object searchMovieByName(String name) {
        JSONObject response = userService.searchMovieByName(name);

        // TODO: test the error codes work
        if(response.has("error")){
            String error = response.getString("error");
            if (error.equals("Invalid input")) {
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            } else {
                return new ResponseEntity<Object>(response.toString(), HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
        }
    }


}
