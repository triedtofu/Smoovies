package com.example.restservice.database;

import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.User;

import java.util.List;
import java.util.ArrayList;


@Repository("TestUserDAO")
public class TestUserDataAccessService implements UserDAO {
    
    private static List<User> testDB = new ArrayList<>();

    @Override
    public int addUser(User user, UUID id) {
        testDB.add(new User(id, user.getName(), user.getEmail(), user.getPassword(), false));
        return 1;
    }

    @Override
    public int addAdmin(User user, UUID id) {
        testDB.add(new User(id, user.getName(), user.getEmail(), user.getPassword(), true));
        return 1;
    }

    @Override
    public User getUserById(UUID id) {
        for(int i = 0; i < testDB.size(); i++) {
            if (testDB.get(i).getId() == id) {
                return testDB.get(i);
            }
        }
        return null;
    }

    @Override
    public User getUserByEmailPassword(String email, String password) {
        for(int i = 0; i < testDB.size(); i++) {
            if (testDB.get(i).getEmail().equals(email) && testDB.get(i).getPassword().equals(password)) {
                return testDB.get(i);
            }
        }
        return null;
    }

    @Override
    public List <User> getAllUsers() {
        return testDB;
    }

}
