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
@Table(name = "actors")
public class Actor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "actorsInMovie")
    Set<Movie> actorIsIn = new HashSet<>();
    

    public Actor() {
        super();
    }

    public Actor( 
                @JsonProperty("name") String name) {
        super();
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public void setName (String name) {
        this.name = name;
    }
 
    public Set<Movie> getMovieActorsIn() {
        return actorIsIn;
    }
 
}
