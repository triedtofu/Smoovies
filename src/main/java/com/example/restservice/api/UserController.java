package com.example.restservice.api;

import com.example.restservice.dataModels.*;
import com.example.restservice.service.ReviewService;
import com.example.restservice.service.UserService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
//import org.springframework.util.MultiValueMap;

import org.json.JSONObject;

import java.util.List;

//import com.example.restservice.api.ControllerResponses;

//import com.fasterxml.jackson.annotation.JsonProperty;

//Expose endpoints so clients can consume 
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private final UserService userService;

    @Autowired
    private final ReviewService reviewService;
    
    @Autowired
    public UserController(UserService userService, ReviewService reviewService) {
        this.userService = userService;
        this.reviewService = reviewService;
    }

    @PostMapping("/login")
    public ResponseEntity<Object> Login(@RequestBody User user) {
        JSONObject response = userService.UserLogin(user.getEmail(), user.getPassword());
        return ControllerResponses.generateHttpResponse(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> Register(@RequestBody User user) {

        // admin accounts are created in backend, if calling this api, assume it is from frontend (therefore admin = false)
        JSONObject response = userService.register(user, false);

        return ControllerResponses.generateHttpResponse(response);
    }

    
    @GetMapping("/getAllUsers")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }


    @GetMapping("/wishlist")
    public ResponseEntity<Object> getUserWishlist(@RequestParam(name = "userId") long id) {
        JSONObject response = userService.getUserWishlist(id);
        return ControllerResponses.generateHttpResponse(response);
    }

    @PutMapping("/wishlist")
    public ResponseEntity<Object> updateUserWishlist(@RequestBody UpdateWishlistRequest updateWishlistRequest) {
        AuthenticationToken authenticationToken = new AuthenticationToken(updateWishlistRequest.getToken());
        JSONObject response = userService.updateUserWishlist(authenticationToken, updateWishlistRequest.getMovieId(), updateWishlistRequest.getAddRemove());
        return ControllerResponses.generateHttpResponse(response);
    }

    @GetMapping("/reviews") 
    public ResponseEntity<Object> getUserReviews(@RequestParam(name = "userId") long id) {
        JSONObject response = reviewService.getUserReviews(id);
        return ControllerResponses.generateHttpResponse(response);
    }

}
