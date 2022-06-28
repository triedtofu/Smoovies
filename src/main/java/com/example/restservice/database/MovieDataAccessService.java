package com.example.restservice.database;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.Movie;
import org.springframework.data.jpa.repository.Query;

//the Long is from id type 
@Repository 
public interface MovieDataAccessService extends JpaRepository<Movie, Long>{
    @Query(value = "SELECT * FROM movies limit 12", nativeQuery = true)
    public List<Movie> trending();
}
