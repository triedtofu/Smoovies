package com.example.restservice.database;

import java.util.List;

import com.example.restservice.dataModels.User;

public interface UserDAO {
    
    int addUser(User user);

    List<User> getAllUsers();
}
