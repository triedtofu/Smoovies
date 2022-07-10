package com.example.restservice.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.Actor;

@Repository
public interface ActorDataAccessService extends JpaRepository<Actor, Long> {
    @Query(value = "SELECT * FROM actors a WHERE a.name = :name", nativeQuery = true)
    public Actor findActorByName(@Param("name") String name);
}
