package com.example.restservice.service;

import java.util.List;
import java.util.ArrayList;


import com.example.restservice.database.MovieDataAccessService;
import com.example.restservice.dataModels.Movie;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import org.json.JSONObject;
import org.json.JSONArray;

import java.util.HashMap;
import com.example.restservice.service.ServiceErrors;
@Service
public class MovieService {
    
    @Autowired
	private MovieDataAccessService movieDAO;

    /**
     * Adds a movie to the database
     * @param movie
     * @return movie id, name, year
     */
    public JSONObject addMovie(Movie movie) {

        // TODO: check movie values for errors
        if (!ServiceInputChecks.checkMovie(movie)) {
            return ServiceErrors.invalidInputError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        try{
            Movie dbMovie = movieDAO.save(movie);

            // set return response values
            // TODO: Add token implementation
            returnMessage.put("movieId", dbMovie.getId());
            returnMessage.put("name", dbMovie.getName());
            returnMessage.put("year", dbMovie.getYear());
        } catch(IllegalArgumentException e){
            return ServiceErrors.invalidInputError();
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    /**
     * Grabs all movies from the database
     * @return List of all movies
     */
    public List<Movie> getAllMovies() {  
        return movieDAO.findAll();
    }


    /**
     * Grabs the complete details of a movie by id
     * @param id
     * @return complete details of movie, all variables in Movies.java
     */
    public JSONObject getMovieDetails(long id) {

        // TODO: check id received for errors
        if (!ServiceInputChecks.checkId(id)) {
            return ServiceErrors.invalidInputError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        
        // TODO: Query the database by movie id, need to get actors(cast), genres and reviews as well
        Movie dbMovie = new Movie();
        // TODO: if movie found
        if (dbMovie != null) {
            returnMessage.put("name", dbMovie.getName());
            returnMessage.put("year", dbMovie.getYear());
            returnMessage.put("poster", dbMovie.getPoster());
            returnMessage.put("description", dbMovie.getDescription());
            returnMessage.put("director", dbMovie.getDirector());
            //TODO: add genres
            returnMessage.put("contentRating", dbMovie.getContentRating());
            //TODO: add cast
            //TODO: add reviews
        }
        // otherwise if movie not found, return error 
        else {
            return ServiceErrors.notFoundError();
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;

    }
    public JSONObject homepage() {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        //Stores the movie's used for homepage.
        JSONArray homepageList = new JSONArray();
        //Needs to query the movie database to find the trending logic, currently adds the first 12 movies in our database.
        List<Movie> movies = this.trending();
        if (movies.size() > 0) {
            for (int i=0; i < movies.size(); i++) {
                Movie movie = movies.get(i);
                //Puts the fields into a Hashmap --> JSON Object
                HashMap<String,Object> dbMovieDetails = new HashMap<String,Object>();
                dbMovieDetails.put("id", movie.getId());
                dbMovieDetails.put("name", movie.getName());
                dbMovieDetails.put("year", movie.getYear());
                dbMovieDetails.put("poster", movie.getPoster());
                dbMovieDetails.put("description", movie.getDescription());
                //Make it into a JSONObject
                JSONObject movieDetailsJson = new JSONObject(dbMovieDetails);
                //Put the object into the JSONArray
                homepageList.put(movieDetailsJson);
            }
        } else {
            return ServiceErrors.notFoundError();
        }
        returnMessage.put("movies", homepageList);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    /**
     * Grabs a list of movies that satisfy the search condition by name
     * @param name
     * @return JSONObject containing  {"movies": JSONArray of movies}
     */
    public JSONObject searchMovieByName(String name) {

        // TODO: check movie name errors
        if (!ServiceInputChecks.checkName(name)) {
            return ServiceErrors.invalidInputError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        // stores array of movies that are found by the search
        JSONArray moviesArray = new JSONArray();

        // TODO: Query the database by movie name, need to get genres as well
        List<Movie> dbMovies = new ArrayList<Movie>();
        // TODO: if valid movies are found (list of movies is larger than size 0)
        if (dbMovies.size() > 0) {
            for(int i = 0; i < dbMovies.size(); i++) {
                Movie dbMovie = dbMovies.get(i);
                HashMap<String,Object> dbMovieDetails = new HashMap<String,Object>();
                dbMovieDetails.put("id", dbMovie.getId());
                dbMovieDetails.put("name", dbMovie.getName());
                dbMovieDetails.put("year", dbMovie.getYear());
                dbMovieDetails.put("poster", dbMovie.getPoster());
                dbMovieDetails.put("description", dbMovie.getDescription());
                //TODO: add genres
                JSONObject dbMovieDetailsJson = new JSONObject(dbMovieDetails);
                moviesArray.put(dbMovieDetailsJson);
            }
        } 
        // otherwise if no movies found, return not found error
        else {
            return ServiceErrors.notFoundError();
        }

        returnMessage.put("movies", moviesArray);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;

    }
    /**
     * Determines what movie's are "trending"
     * The homepage has 12 movie's on it.
     * @return
     */
    public List<Movie> trending() {
        //TODO: Write an algorithm which will find the trending movie's.
        List<Movie> movieList = movieDAO.trending();
        return movieList;
    }

}
