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
    /* 
    @PostMapping("/login")
    public Object authenticateUser(@RequestBody User user) {
        JSONObject response = userService.authenticateUser(user);

        if(response.has("error")){
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
        }
    }*/


    @PostMapping("/register")
    public ResponseEntity<Object> addUser(@RequestBody User user) {

        JSONObject response = userService.addUser(user);

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


}
