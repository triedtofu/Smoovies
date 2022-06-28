package com.example.restservice.dataModels;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserIdRequest {
    private long userId;

    public UserIdRequest(@JsonProperty("userId") long userId) {
        this.userId = userId;
    }


    public long getUserId() {
        return userId;
    }

}
