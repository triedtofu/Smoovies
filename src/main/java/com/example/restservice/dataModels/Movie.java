package com.example.restservice.dataModels;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "name")
    private String name;

    @Column(name = "year")
    private int year;

    @Column(name = "poster")
    private String poster;

    @Column(name = "description", columnDefinition= "text")
    private String description;

    @Column(name = "director")
    private String directors;

    @Column(name = "contentRating")
    private String contentRating;

    @Column(name = "runtime")
    private int runtime;

    @ManyToMany(mappedBy = "wishList")
    private Set<User> userWishlists = new HashSet<>();

    @Column(name = "actorCast")
    private String cast;

    @Transient
    private List<String> genres = new ArrayList<>();

    @Column(name = "trailer")
    private String trailer;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "actorsIsIn",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "actor_id")
    )
    private Set<Actor> actorsInMovie = new HashSet<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "directorsIsIn",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "director_id")
    )
    private Set<Director> directorsInMovie = new HashSet<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "movie_genres",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> movieGenres = new HashSet<>();

    public Movie() {
        super();
    }

    public Movie(
                @JsonProperty("name") String name,
                @JsonProperty("year") int year,
                @JsonProperty("poster") String poster,
                @JsonProperty("description") String description,
                @JsonProperty("director") String directors,
                @JsonProperty("contentRating") String contentRating,
                @JsonProperty("cast") String cast,
                @JsonProperty("genres") List<String> genres,
                @JsonProperty("trailer") String trailer,
                @JsonProperty("runtime") int runtime
                ) {
        super();
        this.name = name;
        this.year = year;
        this.poster = poster;
        this.description = description;
        this.directors = directors;
        this.contentRating = contentRating;
        this.cast = cast;
        this.genres = genres;
        this.trailer = trailer;
        this.runtime = runtime;
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

    public int getRtuntime() {
        return runtime;
    }

    public String getPoster() {
        return poster;
    }

    public String getDescription() {
        return description;
    }

    public String getDirectors() {
        return directors;
    }

    public String getContentRating() {
        return contentRating;
    }

    public String getCast() {
        return cast;
    }

    public Set<User> getUserWishlist() {
        return this.userWishlists;
    }

    public void addActorToCast(Actor actor) {
        this.actorsInMovie.add(actor);
    }

    public void addDirector(Director director) {
        this.directorsInMovie.add(director);
    }

    public List<String> getGenreString() {
        return this.genres;
    }

    public void addGenreToDB(Genre g) {
        this.movieGenres.add(g);
    }

    public String getTrailer() {
        return this.trailer;
    }

    public Set<Genre> getGenreList() {
        return this.movieGenres;
    }

    public List<String> getGenreListStr() {
        return Genre.genreCollectionToStrList(this.movieGenres);
    }

    /**
     * Clears the sets of actors, directors, reviews,
     */
    public void deleteMovieDependencies() {
        this.actorsInMovie.clear();
        this.directorsInMovie.clear();
        this.movieGenres.clear();
    }
}
