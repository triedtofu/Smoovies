package com.example.restservice.dataModels;

import java.math.BigDecimal;
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
import javax.persistence.OneToMany;
import javax.persistence.PreRemove;
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

    @OneToMany(mappedBy = "movie")
    private Set<Review> movieReviews = new HashSet<>();

    @Column(precision=2,scale=1)
    private BigDecimal average_rating;

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
        this.average_rating = new BigDecimal(0.00);
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

    public int getRuntime() {
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


    public void addReviewToMovie(Review review) {
        this.movieReviews.add(review);
    }

    public Set<Review> getMovieReviews() {
        return movieReviews;
    }

    @PreRemove
    private void removeMoviesFromUserWishlists(){
        for (User u : userWishlists) {
            u.removeWishlist(this);
        }
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public void setTrailer(String trailer) {
        this.trailer = trailer;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDirectors(String directors) {
        this.directors = directors;
    }

    public void setContentRating(String contentRating) {
        this.contentRating = contentRating;
    }

    public void setRuntime(int runtime) {
        this.runtime = runtime;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public void setCast(String cast) {
        this.cast = cast;
    }

    public void clearDBGenres() {
        this.movieGenres.clear();
    }

    public void clearDBCast() {
        this.actorsInMovie.clear();
    }

    public void clearDBDirectors() {
        this.directorsInMovie.clear();
    }

    public void recalculateAverageRating() {
        double total = 0;
        if (movieReviews.isEmpty()) return;
        for (Review review : movieReviews) {
            total = total + review.getRating();
        }
        this.average_rating = new BigDecimal(total/movieReviews.size());
    }

    public double getAverageRating() {
        return average_rating.doubleValue();
    }
}
