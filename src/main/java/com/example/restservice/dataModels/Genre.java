package com.example.restservice.dataModels;

import java.util.HashSet;
import java.util.Set;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "genres")
public class Genre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "movieGenres")
    Set<Movie> moviesInGenre = new HashSet<>();

    public Genre() {
        super();
    }

    public Genre(@JsonProperty("name") String name) {
        super();
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public static List<String> genreCollectionToStrList(Collection<Genre> genres) {
        List<String> genreList = new ArrayList<>();
        for (Genre genre : genres) genreList.add(genre.getName());
        return genreList;
    }

    public boolean movieInGenre(Movie movie) {
        if (moviesInGenre.contains(movie)) return true;
        return false;
    }

    public Set<Movie> getMoviesInGenre() {
        return this.moviesInGenre;
    }

    public long getId() {
        return id;
    }
}
