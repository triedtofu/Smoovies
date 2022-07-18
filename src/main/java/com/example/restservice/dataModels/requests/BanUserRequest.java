package com.example.restservice.dataModels.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BanUserRequest {
    private String token;
    private long userId;

    public BanUserRequest(@JsonProperty("token") String token,
                            @JsonProperty("userId") long userID) {
        this.token = token;
        this.userId = userID;
    }

    public String getToken() {
        return token;
    }

    public long getUserId() {
        return userId;
    }
}
