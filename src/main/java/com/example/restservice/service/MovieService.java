package com.example.restservice.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;

import org.apache.tomcat.jni.Address;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.restservice.dataModels.Actor;
import com.example.restservice.dataModels.DeleteMovieRequest;
import com.example.restservice.dataModels.AddMovieRequest;
import com.example.restservice.dataModels.AddReviewRequest;
import com.example.restservice.dataModels.Director;
import com.example.restservice.dataModels.Genre;
import com.example.restservice.dataModels.Movie;
import com.example.restservice.dataModels.User;
import com.example.restservice.dataModels.Review;
import com.example.restservice.database.ActorDataAccessService;
import com.example.restservice.database.DirectorDataAccessService;
import com.example.restservice.database.GenreDataAccessService;
import com.example.restservice.database.MovieDataAccessService;
import com.example.restservice.database.UserDataAccessService;

//import com.example.restservice.service.ServiceErrors;
@Service
public class MovieService {
    
    @Autowired
	private MovieDataAccessService movieDAO;

    @Autowired
    private ActorDataAccessService actorDAO;

    @Autowired
    private DirectorDataAccessService directorDAO;

    @Autowired
    private GenreDataAccessService genreDAO;

    @Autowired
    private UserDataAccessService userDAO;

    /**
     * Adds a movie to the database
     * @param movie
     * @return movie id, name, year
     */
    public JSONObject addMovie(AddMovieRequest addMovieRequest) {

        // split the request into its components
        String userToken = addMovieRequest.getToken();
        Movie movie = addMovieRequest.getMovie();

        // TODO: check movie values for errors
        if (!ServiceInputChecks.checkMovie(movie)) {
            return ServiceErrors.invalidInputError();
        }
        // verify the token and extract the users id
        Long user_id = ServiceJWTHelper.getTokenId(userToken);
        if (user_id == null) {
            return ServiceErrors.userTokenInvalidError();
        } 
        // get the users isAdmin permission, if not admin, return error
        User user = userDAO.findById(user_id).get();
        if (!user.getIsAdmin()) {
            return ServiceErrors.userAdminPermissionError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        try{
            Movie dbMovie = movieDAO.save(movie);
            String cast = movie.getCast();
            String directors = movie.getDirectors();
            List<String> genres = movie.getGenreString();
            //Add actors when adding movie
            if (!cast.isEmpty()) {
                //Change the cast to an array of strings.
                List<String> actorList = Arrays.asList(cast.split(",[ ]*"));
                //Make a new actor for each string
                for (String a: actorList) {
                    //Check if the actor exists in the database first.
                    if (actorDAO.findActorByName(a) != null) {
                        Actor dbActor = actorDAO.findActorByName(a);
                        dbMovie.addActorToCast(dbActor);
                        movieDAO.save(dbMovie);
                    } else {
                        Actor actor = new Actor(a);
                        actorDAO.save(actor);
                        dbMovie.addActorToCast(actor);
                        movieDAO.save(dbMovie);
                    }
                }
            }
            //Add directors when adding movie
            if (!directors.isEmpty()) {
                List<String> directorsList = Arrays.asList(directors.split(",[ ]*"));
                for (String d: directorsList) {
                    if (directorDAO.findDirectorByName(d) != null) {
                        Director dbDirector = directorDAO.findDirectorByName(d);
                        dbMovie.addDirector(dbDirector);
                        movieDAO.save(dbMovie);
                    } else {
                        Director director = new Director(d);
                        directorDAO.save(director);
                        dbMovie.addDirector(director);
                        movieDAO.save(dbMovie);
                    }
                }
            }
            if (!genres.isEmpty() && genres != null) {
                for (String g : genres) {
                    Genre genre = new Genre(g);
                    if (genreDAO.findGenreByName(genre.getName()) != null) {
                        //This means the Genre is in the database, so it is a valid genre.
                        Genre dbGenre = genreDAO.findGenreByName(genre.getName());
                        dbMovie.addGenreToDB(dbGenre);
                        movieDAO.save(dbMovie);
                    } else {
                        //Return an invalid input error.
                        return ServiceErrors.invalidInputError();
                    }
                }
            }
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
            return ServiceErrors.movieIdInvalidError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        
        Movie dbMovie = movieDAO.findMovieByID(id);

        if (dbMovie != null) {
            returnMessage.put("name", dbMovie.getName());
            returnMessage.put("year", dbMovie.getYear());
            returnMessage.put("poster", dbMovie.getPoster());
            returnMessage.put("trailer", dbMovie.getTrailer());
            returnMessage.put("description", dbMovie.getDescription());
            returnMessage.put("director", dbMovie.getDirectors());
            returnMessage.put("contentRating", dbMovie.getContentRating());
            returnMessage.put("cast", dbMovie.getCast()); 
            JSONArray genreList = new JSONArray();
            Set<Genre> movieGenres = dbMovie.getGenreList();
            for (Genre g : movieGenres) {
                genreList.put(g.getName());
            }
            returnMessage.put("genres", genreList);
            //TODO: add reviews
        }
        // otherwise if movie not found, return error 
        else {
            return ServiceErrors.movieNotFoundError();
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
            return ServiceErrors.movieTrendingEmptyError();
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
            return ServiceErrors.movieNameInvalidError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        // stores array of movies that are found by the search
        JSONArray moviesArray = new JSONArray();

        List<Movie> dbMovies = movieDAO.searchMovieByName(name);
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
            return ServiceErrors.movieNotFoundError();
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
    public JSONObject deleteMovie (DeleteMovieRequest request) {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        // verify the token and extract the users id
        Long user_id = ServiceJWTHelper.getTokenId(request.getToken());
        if (user_id == null) {
            return ServiceErrors.userTokenInvalidError();
        } 
        // get the users isAdmin permission, if not admin, return error
        User user = userDAO.findById(user_id).get();
        if (!user.getIsAdmin()) {
            return ServiceErrors.userAdminPermissionError();
        }

        //Delete movie from database by id. 
        //Find the movie by id, clear all the sets from genre etc and then delete the movie
        Movie dbMovie = movieDAO.findMovieByID(request.getMovieId());
        if (dbMovie != null) {
            movieDAO.deleteById(dbMovie.getId());
        } else {
            return ServiceErrors.movieNotFoundError();
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    public JSONObject addReview (AddReviewRequest addReviewRequest) {

        // split the request into its parts
        String token = addReviewRequest.getToken();
        Review review = addReviewRequest.getReview();

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        // check valid inputs
        // check movieId exists/is valid
        Movie movie = movieDAO.findMovieByID(review.getMovieId());
        if (movie == null) {
            return ServiceErrors.movieNotFoundError();
        }

        // verify the token and extract the users id
        Long user_id = ServiceJWTHelper.getTokenId(token);
        if (user_id == null) {
            return ServiceErrors.userTokenInvalidError();
        } 
        // Fill in the userId of Review object
        review.setUserId(user_id);

        // TODO: send the request to DB



        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    public JSONObject getAllGenres() {

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        JSONArray genresListJson = new JSONArray();
        List<Genre> genresList = genreDAO.findAll();

        for (int i = 0; i < genresList.size(); i++) {
            genresListJson.put(genresList.get(i).getName());
        }

        returnMessage.put("genres", genresListJson);

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
}
