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
@Table(name = "directors")
public class Director {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "directorsInMovie")
    Set<Movie> directorIsIn = new HashSet<>();

    public Director() {
        super();
    }
    public Director( 
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

    public Set<Movie> getDirectorIsIn() {
        return directorIsIn;
    }
}
