package com.example.restservice.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.User;

//the Long is from id type 
@Repository 
public interface UserDataAccessService extends JpaRepository<User, Long>{
    //User getUserByEmailPassword(String email, String password);
}
