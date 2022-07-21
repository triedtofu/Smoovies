package com.example.restservice.database;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.Actor;
import com.example.restservice.dataModels.Director;

@Repository
public interface DirectorDataAccessService extends JpaRepository<Director, Long> {
    @Query(value = "SELECT * FROM directors d WHERE d.name = :name", nativeQuery = true)
    public Director findDirectorByName (@Param("name") String name);

    @Query(value = "SELECT * FROM directors d WHERE d.id = :id", nativeQuery = true)
    public Director findDirectorById(@Param("id") Long id);

    @Query(value = "SELECT * FROM directors d WHERE d.name ILIKE %:name%", nativeQuery = true)
    public List<Director> searchDirectorByName(@Param("name") String name);
}
