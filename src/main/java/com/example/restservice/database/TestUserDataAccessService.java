package com.example.restservice.database;

import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.User;

import java.util.List;
import java.util.ArrayList;

@Repository("TestUserDAO")
public class TestUserDataAccessService implements UserDAO {
    
    //This is the database, will need to change this.
    private static List<User> testDB = new ArrayList<>();

    @Override
    public int addUser(User user) {
        // generate random user ID for now
        testDB.add(new User(user.getName(), user.getEmail(), user.getPassword()));
        return 1;
    }

    @Override
    public List <User> getAllUsers() {
        return testDB;
    }

}
