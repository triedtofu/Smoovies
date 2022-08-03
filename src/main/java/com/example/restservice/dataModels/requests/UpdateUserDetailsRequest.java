package com.example.restservice.dataModels.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UpdateUserDetailsRequest {
    private String token;
    private String name;
    private String email;
    private String oldPassword;
    private String password;

    public UpdateUserDetailsRequest(@JsonProperty("token") String token,
    @JsonProperty("name") String name,
    @JsonProperty("email") String email,
    @JsonProperty("oldPassword") String oldPassword,
    @JsonProperty("password") String password) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.oldPassword = oldPassword;
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public String getPassword() {
        return password;
    }
}
