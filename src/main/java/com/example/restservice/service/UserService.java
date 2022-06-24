package com.example.restservice.service;

import java.util.List;

import com.example.restservice.dataModels.User;
import com.example.restservice.database.UserDAO;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

@Service
public class UserService {
    
    
    private final UserDAO userDAO;
    
    @Autowired
    public UserService(@Qualifier("TestUserDAO") UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public int addUser(User user) {
        return userDAO.addUser(user);
    }

    public List<User> getAllUsers() {
        return userDAO.getAllUsers();
    }
}
