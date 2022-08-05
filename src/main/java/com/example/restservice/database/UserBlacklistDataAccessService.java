package com.example.restservice.database;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.UserBlacklist;

/**
 * Implementation of JpaRepository for managing the UserBlacklist models Data
 */
@Repository
public interface UserBlacklistDataAccessService extends JpaRepository<UserBlacklist, Long>{

    /**
     * Finds the blacklist for the input user.
     * @param user_id
     * @return List<UserBlacklist>
     */
    @Query(value = "SELECT * FROM userblacklist b WHERE b.user_id = :user_id", nativeQuery = true)
    public List<UserBlacklist> findUserBlacklistById(@Param("user_id") Long user_id);

    /**
     * Find the blacklist for the user, and find a specified user within the blacklist.
     * @param userId
     * @param blacklisted_user_id
     * @return UserBlacklist
     */
    @Query(value = "SELECT * FROM userblacklist b WHERE b.user_id = :user_id and b.blacklisted_user_id = :blacklisted_user_id", nativeQuery = true)
    public UserBlacklist findUserFromBlacklist(@Param("user_id") Long userId, @Param("blacklisted_user_id") Long blacklisted_user_id);
}



