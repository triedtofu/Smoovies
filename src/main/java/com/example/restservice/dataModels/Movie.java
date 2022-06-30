package com.example.restservice.dataModels;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "name")
    private  String name;
    
    @Column(name = "year")
    private  int year;

    @Column(name = "poster")
    private String poster;
  
    @Column(name = "description")
    private String description;

    @Column(name = "director")
    private String director;

    @Column(name = "contentRating")
    private String contentRating;

    @ManyToMany(mappedBy = "wishList")
    private Set<User> userWishlists = new HashSet<>();

    public Movie() {
        super();
    }

    public Movie(
                @JsonProperty("name") String name,
                @JsonProperty("year") int year,
                @JsonProperty("poster") String poster,
                @JsonProperty("description") String description,
                @JsonProperty("director") String director,
                @JsonProperty("contentRating") String contentRating) {
        super();
        this.name = name;
        this.year = year;
        this.poster = poster;
        this.description = description;
        this.director = director;
        this.contentRating = contentRating;

    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getYear() {
        return year;
    }

    public String getPoster() {
        return poster;
    }

    public String getDescription() {
        return description;
    }

    public String getDirector() {
        return director;
    }

    public String getContentRating() {
        return contentRating;
    }

    public Set<User> getUserWishlist() {
        return this.userWishlists;
    }

   


}
