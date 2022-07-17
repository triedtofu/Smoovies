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

    @Query(value = "SELECT * FROM users u WHERE u.id = :id", nativeQuery = true)
    public User findUserById(@Param("id") Long id);

    @Query(value = "SELECT * FROM users u WHERE u.email = :email and u.password = crypt(:password, u.password)", nativeQuery = true)
    public User findUserByEmailPassword(@Param("email") String email, @Param("password") String password);

    @Query(value = "INSERT INTO users (email, is_admin, name, password) VALUES (:email, false, :name, crypt(:password, gen_salt('bf'))) RETURNING *", nativeQuery = true)
    User saveUser(@Param("email") String email, @Param("password") String password, @Param("name") String name);

    public default Boolean uniqueEmail(String email) {
        User user = findUserByEmail(email);
        if (user == null) {
            return true;
        }
        return false;
    }
}
