package com.example.restservice.api;

import com.example.restservice.dataModels.User;
import com.example.restservice.dataModels.UserLoginDetails;
import com.example.restservice.service.UserService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;

import org.json.JSONObject;

import java.util.List;

import com.example.restservice.api.ControllerResponses;

//Expose endpoints so clients can consume 
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<Object> Login(@RequestBody UserLoginDetails loginDetails) {
        JSONObject response = userService.UserLogin(loginDetails.getEmail(), loginDetails.getPassword());
        return ControllerResponses.responseInputOnly(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> Register(@RequestBody User user) {

        // admin accounts are created in backend, if calling this api, assume it is from frontend (therefore admin = false)
        JSONObject response = userService.register(user, false);

        return ControllerResponses.responseInputOnly(response);
    }

    
    @GetMapping("/getAllUsers")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }


    @GetMapping("/wishlist")
    public ResponseEntity<Object> getUserWishlist(long id) {
        JSONObject response = userService.getUserWishlist(id);

        return ControllerResponses.responseInputAndSearch(response);
    }

}
