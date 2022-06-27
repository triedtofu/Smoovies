package com.example.restservice.dataModels;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private  String name;
    
    @Column(name = "email")
    private  String email;

    @Column(name = "password")
    private String password;
  
    @Column(name = "isAdmin")
    private Boolean isAdmin;

    @Column(name = "token")
    private String token;

    public User() {
        super();
    }

    public User(
                @JsonProperty("name") String name,
                @JsonProperty("email") String email,
                @JsonProperty("password") String password,
                @JsonProperty("token") String token,
                Boolean isAdmin) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
        this.token = token;
    }

    public Long getId() {
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

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
