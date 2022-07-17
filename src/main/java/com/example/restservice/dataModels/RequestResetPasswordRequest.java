package com.example.restservice.dataModels;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RequestResetPasswordRequest {
    
    private String email;
    public RequestResetPasswordRequest(@JsonProperty("email") String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

}

    


