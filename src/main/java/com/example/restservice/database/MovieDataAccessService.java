package com.example.restservice.database;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.Movie;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Implementation of JpaRepository for managing the Movie models Data
 */
@Repository 
public interface MovieDataAccessService extends JpaRepository<Movie, Long>{
    /**
     * Finds movie by ID
     * @param id
     * @return Movie
     */
    @Query(value = "SELECT * FROM movies m WHERE m.id = :id", nativeQuery = true)
    public Movie findMovieByID(@Param("id") long id);
    /**
     * Searches by name and orders by the average-rating
     * @param name
     * @return List<Movie>
     */
    @Query(value = "SELECT * FROM movies m WHERE m.name iLIKE %:name% ORDER BY average_rating DESC, name", nativeQuery = true)
    public List<Movie> searchMovieByName(@Param("name") String name);
    /**
     * Deletes the movie with the given id
     * @param id
     */
    @Query(value = "DELETE FROM movies m WHERE m.id = :id", nativeQuery = true)
    public void deleteMovie(@Param("id") long id);
    /**
     * Returns all movies sorted by rating.
     * @return
     */
    @Query(value = "SELECT * FROM movies m ORDER BY m.average_rating DESC", nativeQuery = true)
    public List<Movie> topRated();
    @Query(value = "SELECT * FROM movies m WHERE m.description iLIKE %:description% ORDER BY average_rating DESC, name", nativeQuery = true)
    public List<Movie> searchMovieByDescription(@Param("description") String description);
    
}
