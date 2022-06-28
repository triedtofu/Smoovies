package com.example.restservice.dataModels;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthenticationToken {
    private String token;
    private long userId;

    // constructor for when we create the token object in backend e.g login
    public AuthenticationToken(String token, long userId) {
        this.token = token;
        this.userId = userId;
    }

    // constructor when only given token string from frontend
    public AuthenticationToken(@JsonProperty("token") String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public long getUserId() {
        return userId;
    }
}
