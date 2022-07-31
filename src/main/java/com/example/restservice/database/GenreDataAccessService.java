package com.example.restservice.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.Genre;

@Repository
public interface GenreDataAccessService extends JpaRepository<Genre, Long> {
    @Query(value = "SELECT * from genres g WHERE g.name = LOWER(:name)", nativeQuery = true)
    public Genre findGenreByName(@Param("name") String name);

}
