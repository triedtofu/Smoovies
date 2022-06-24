package com.example.restservice.database;

import java.util.List;
import java.util.UUID;

import com.example.restservice.dataModels.User;


public interface UserDAO {
    
    int addUser(User user, UUID id);

    int addAdmin(User user, UUID id);

    User getUserById(UUID id);

    User getUserByEmailPassword(String email, String password);

    List<User> getAllUsers();
}
