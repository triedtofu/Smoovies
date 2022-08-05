package com.example.restservice.database;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.Actor;

/**
 * Implementation of JpaRepository for managing the Actor models Data
 */
@Repository
public interface ActorDataAccessService extends JpaRepository<Actor, Long> {
    /**
     * Finds an actor by their name
     * @param name full name of the actor
     * @return an Actor
     */
    @Query(value = "SELECT * FROM actors a WHERE a.name = :name", nativeQuery = true)
    public Actor findActorByName(@Param("name") String name);
    /**
     * Finds an actor by their id 
     * @param id id of the actor
     * @return an actor
     */
    @Query(value = "SELECT * FROM actors a WHERE a.id = :id", nativeQuery = true)
    public Actor findActorById(@Param("id") Long id);
    /**
     * Searches the database for actors which contain name
     * @param name
     * @return
     */
    @Query(value = "SELECT * FROM actors a WHERE a.name ILIKE %:name%", nativeQuery = true)
    public List<Actor> searchActorByName(@Param("name") String name);
}
