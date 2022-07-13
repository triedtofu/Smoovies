package com.example.restservice.api;

//import java.lang.ModuleLayer.Controller;
import java.util.List;
//import java.util.ResourceBundle.Control;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

//import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.restservice.dataModels.DeleteMovieRequest;
import com.example.restservice.dataModels.AddMovieRequest;
import com.example.restservice.dataModels.AddReviewRequest;
import com.example.restservice.dataModels.Movie;
//import com.example.restservice.dataModels.MovieIdRequest;
import com.example.restservice.service.MovieService;

//import com.example.restservice.api.ControllerResponses;

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
    public ResponseEntity<Object> addMovie(@RequestBody AddMovieRequest movie) {

        // admin accounts are created in backend, if calling this api, assume it is from frontend (therefore admin = false)
        JSONObject response = movieService.addMovie(movie);

        return ControllerResponses.responseInputOnly(response);
    }

    @GetMapping("/getAllMovies")
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }
    
    @GetMapping("/homepage")
    public ResponseEntity<Object> homepage() {
        JSONObject response = movieService.homepage();
        return ControllerResponses.responseInputOnly(response);
    }

    @GetMapping("/getMovie")
    public ResponseEntity<Object> getMovie(@RequestParam(name = "id") long id) {
        JSONObject response = movieService.getMovieDetails(id);
        return ControllerResponses.responseInputAndSearchDatabase(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Object> searchMovieByName(@RequestParam(name = "name") String name) {
        JSONObject response = movieService.searchMovieByName(name);
        return ControllerResponses.responseInputAndSearchDatabase(response);
    }

    @PostMapping("/deleteMovie")
    public ResponseEntity<Object> deleteMovie(@RequestBody DeleteMovieRequest request) {
        JSONObject response = movieService.deleteMovie(request);
        return ControllerResponses.responseInputOnly(response);
    }

    @PostMapping("/addReview")
    public ResponseEntity<Object> addReview(@RequestBody AddReviewRequest request) {
        JSONObject response = movieService.addReview(request);
        return ControllerResponses.responseInputOnly(response);
    }

    @GetMapping("/genres")
    public ResponseEntity<Object> getAllGenres() {
        JSONObject response = movieService.getAllGenres();
        return ControllerResponses.responseInputOnly(response);
    }
}
