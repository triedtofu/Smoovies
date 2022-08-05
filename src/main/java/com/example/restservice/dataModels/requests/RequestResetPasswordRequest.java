package com.example.restservice.dataModels.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class containing all fields for a request from REST API to send a reset password email
 */
public class RequestResetPasswordRequest {
    
    private String email;
    public RequestResetPasswordRequest(@JsonProperty("email") String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

}

    


