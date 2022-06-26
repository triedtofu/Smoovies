package com.example.restservice.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.Movie;

//the Long is from id type 
@Repository 
public interface MovieDataAccessService extends JpaRepository<Movie, Long>{
    
}
