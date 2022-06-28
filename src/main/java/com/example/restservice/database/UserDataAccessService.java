package com.example.restservice.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.User;

//the Long is from id type 
@Repository 
public interface UserDataAccessService extends JpaRepository<User, Long>{
    /**
     * Finds a user based on their email.
     * Used for login and checking if email exists already.
     * @param email
     * @return
     */
    @Query(value = "SELECT * FROM users u WHERE u.email = :email", nativeQuery = true)
    public User findUserByEmail(@Param("email") String email);
}
