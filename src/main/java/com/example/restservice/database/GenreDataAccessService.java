package com.example.restservice.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.restservice.dataModels.Genre;

/**
 * Implementation of JpaRepository for managing the Genre models Data
 */
@Repository
public interface GenreDataAccessService extends JpaRepository<Genre, Long> {
    /**
     * Look for genres with the same name, Lower to make case insensitive.
     * @param name
     * @return Genre
     */
    @Query(value = "SELECT * from genres g WHERE g.name = LOWER(:name)", nativeQuery = true)
    public Genre findGenreByName(@Param("name") String name);

}
