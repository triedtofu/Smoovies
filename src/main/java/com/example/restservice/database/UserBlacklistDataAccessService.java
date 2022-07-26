package com.example.restservice.database;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.UserBlacklist;

@Repository
public interface UserBlacklistDataAccessService extends JpaRepository<UserBlacklist, Long>{
    @Query(value = "SELECT * FROM userblacklist b WHERE b.user_id = :user_id", nativeQuery = true)
    public List<UserBlacklist> findUserBlacklistById(@Param("user_id") Long user_id);

    @Query(value = "SELECT * FROM userblacklist b WHERE b.user_id = :user_id and b.blacklisted_user_id = :blacklisted_user_id", nativeQuery = true)
    public UserBlacklist findUserFromBlacklist(@Param("user_id") Long userId, @Param("blacklisted_user_id") Long blacklisted_user_id);
}



