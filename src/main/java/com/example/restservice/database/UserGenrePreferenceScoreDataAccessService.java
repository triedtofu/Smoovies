package com.example.restservice.database;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.UserGenrePreferenceScore;

@Repository
public interface UserGenrePreferenceScoreDataAccessService extends JpaRepository<UserGenrePreferenceScore, Long> {
    @Query(value = "SELECT * FROM user_genre_preference_scores u WHERE u.user_id = :user_id and u.genre_id = :genre_id", nativeQuery = true)
    public UserGenrePreferenceScore findUserPreferenceScoreByGenreId(@Param("user_id") Long user_id, @Param("genre_id") Long genre_id);
    
}



