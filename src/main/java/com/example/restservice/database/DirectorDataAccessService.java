package com.example.restservice.database;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.Director;

/**
 * Implementation of JpaRepository for managing the Director models Data
 */
@Repository
public interface DirectorDataAccessService extends JpaRepository<Director, Long> {
    /**
     * Finds a director by their name
     * @param name
     * @return Director
     */
    @Query(value = "SELECT * FROM directors d WHERE d.name = :name", nativeQuery = true)
    public Director findDirectorByName (@Param("name") String name);
    
    /**
     * Queries the databse for a director based on their id
     * @param id
     * @return Director
     */
    @Query(value = "SELECT * FROM directors d WHERE d.id = :id", nativeQuery = true)
    public Director findDirectorById(@Param("id") Long id);
    
    /**
     * Search database for a director based on name 
     * @param name
     * @return List<Director>
     */
    @Query(value = "SELECT * FROM directors d WHERE d.name ILIKE %:name%", nativeQuery = true)
    public List<Director> searchDirectorByName(@Param("name") String name);
}
