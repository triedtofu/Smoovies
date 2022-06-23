package com.example.restservice.dataModels;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

public class User {
    private final UUID id;
    private final String name;
    private final String email;
    private final String password;

    public User(UUID id, 
                @JsonProperty("name") String name,
                @JsonProperty("email") String email,
                @JsonProperty("password") String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
