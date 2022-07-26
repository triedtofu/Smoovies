package com.example.restservice.dataModels.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
public class BlacklistUserRequest {
    private String token;
    private long userId;
    private Boolean addRemove;

    public BlacklistUserRequest(@JsonProperty("token") String token,
                                @JsonProperty("userId") long userId,
                                @JsonProperty("turnon") Boolean addRemove) {
        this.token = token;
        this.userId = userId;
        this.addRemove = addRemove;
    }

    public String getToken() {
        return token;
    }

    public long getUserId() {
        return userId;
    }

    public Boolean getAddRemove() {
        return addRemove;
    }
}


