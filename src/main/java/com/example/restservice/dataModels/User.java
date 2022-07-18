package com.example.restservice.dataModels;

import java.util.HashSet;
import java.util.Set;

//import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private  String name;
    
    @Column(name = "email")
    private  String email;

    @Column(name = "password")
    private String password;
  
    @Column(name = "isAdmin")
    private Boolean isAdmin;

    @Column(name = "token")
    private String token;

    @Column(name = "isBanned")
    private Boolean isBanned;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name="Wishlist",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "movie_id")
    )
    Set<Movie> wishList = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Review> userReviews = new HashSet<>();

    public User() {
        super();
    }

    public User(
                @JsonProperty("name") String name,
                @JsonProperty("email") String email,
                @JsonProperty("password") String password,
                @JsonProperty("token") String token,
                Boolean isAdmin,
                Boolean isBanned) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
        this.token = token;
        this.isBanned = isBanned;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public String getToken() {
        return this.token;
    }

    public Boolean getIsBanned() {
        return isBanned;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Set<Movie> getWishlistMovies() {
        return wishList;
    }
    public void addToWishlist(Movie movie) {
        wishList.add(movie);
    }

    public void removeWishlist(Movie movie) {
        wishList.remove(movie);
    }


    public Set<Review> getUserReviews() {
        return userReviews;
    }

    public void addReviewUser(Review r) {
        this.userReviews.add(r);
    }

    public void removeUserReview(Review r) {
        this.userReviews.remove(r);
    }

    public void setPassword(String password) {
        this.password = password;

    }

    public void setIsBanned(Boolean isBanned) {
        this.isBanned = isBanned;
    }
}
