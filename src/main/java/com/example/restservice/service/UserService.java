package com.example.restservice.service;

import java.util.List;

import com.example.restservice.dataModels.User;
import com.example.restservice.database.UserDataAccessService;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;

@Service
public class UserService {
    
    
    @Autowired
	private UserDataAccessService userDAO;

    public int addUser(User user) {
        if (userDAO.save(user) != null) {
            return 1;
        }
        return 0;
    }

    public List<User> getAllUsers() {
        return userDAO.findAll();
    }
}
