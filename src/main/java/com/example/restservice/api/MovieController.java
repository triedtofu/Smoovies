package com.example.restservice.api;

import com.example.restservice.dataModels.Movie;
import com.example.restservice.service.MovieService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;

import org.json.JSONObject;

import java.util.List;

import com.example.restservice.api.ControllerResponses;

@RestController
@RequestMapping("/api/movie")
public class MovieController {
    @Autowired
    private final MovieService movieService;
    
    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping("/addMovie")
    public ResponseEntity<Object> addMovie(@RequestBody Movie movie) {

        // admin accounts are created in backend, if calling this api, assume it is from frontend (therefore admin = false)
        JSONObject response = movieService.addMovie(movie);

        return ControllerResponses.responseInputOnly(response);
    }

    @GetMapping("/getAllMovies")
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/getMovie")
    public ResponseEntity<Object> getMovie(@PathVariable("movieId")long id) {
        JSONObject response = movieService.getMovieDetails(id);

        return ControllerResponses.responseInputAndSearchDatabase(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Object> searchMovieByName(@PathVariable("name") String name) {
        JSONObject response = movieService.searchMovieByName(name);

        return ControllerResponses.responseInputAndSearchDatabase(response);
    }
}
