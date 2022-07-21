package com.example.restservice.database;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.Movie;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

//the Long is from id type 
@Repository 
public interface MovieDataAccessService extends JpaRepository<Movie, Long>{
    @Query(value = "SELECT * FROM movies limit 12", nativeQuery = true)
    public List<Movie> trending();
    @Query(value = "SELECT * FROM movies m WHERE m.id = :id", nativeQuery = true)
    public Movie findMovieByID(@Param("id") long id);
    @Query(value = "SELECT * FROM movies m WHERE m.name iLIKE %:name% or m.description iLIKE %:name% ORDER BY average_rating DESC, name", nativeQuery = true)
    public List<Movie> searchMovieByName(@Param("name") String name);
    @Query(value = "DELETE FROM movies m WHERE m.id = :id", nativeQuery = true)
    public void deleteMovie(@Param("id") long id);
}
