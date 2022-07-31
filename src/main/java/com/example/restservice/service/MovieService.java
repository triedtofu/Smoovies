package com.example.restservice.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Random;
//import java.util.Collections;
import java.util.HashMap;
import java.util.List;
// import java.util.ArrayList;
// import java.util.Set;
// import java.util.Optional;

import javax.transaction.Transactional;

// import org.apache.tomcat.jni.Address;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.restservice.dataModels.Actor;
import com.example.restservice.dataModels.Director;
import com.example.restservice.dataModels.Genre;
import com.example.restservice.dataModels.Movie;
import com.example.restservice.dataModels.Review;
import com.example.restservice.dataModels.User;
import com.example.restservice.dataModels.requests.AddMovieRequest;
// import com.example.restservice.dataModels.requests.AddReviewRequest;
import com.example.restservice.dataModels.requests.DeleteMovieRequest;
import com.example.restservice.dataModels.requests.EditMovieRequest;
import com.example.restservice.dataModels.requests.SearchRequest;
import com.example.restservice.database.ActorDataAccessService;
import com.example.restservice.database.DirectorDataAccessService;
import com.example.restservice.database.GenreDataAccessService;
import com.example.restservice.database.MovieDataAccessService;
import com.example.restservice.database.ReviewDataAccessService;
import com.example.restservice.database.UserBlacklistDataAccessService;
import com.example.restservice.database.UserDataAccessService;

//import com.example.restservice.service.ServiceErrors;
@Service
@Transactional
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

    @Autowired
    private ReviewDataAccessService reviewDAO;

    @Autowired
    private UserBlacklistDataAccessService userBlacklistDAO;

    /**
     * Adds a movie to the database
     * @param movie
     * @return movie id, name, year
     */
    public JSONObject addMovie(AddMovieRequest addMovieRequest) {

        // split the request into its components
        String userToken = addMovieRequest.getToken();
        Movie movie = addMovieRequest.getMovie();

        // verify the token and extract the users id
        Long user_id = ServiceJWTHelper.getTokenId(userToken, null);
        if (user_id == null) {
            return ServiceErrors.userTokenInvalidError();
        }

        // get the user in database, check if found
        User user = userDAO.findById(user_id).orElse(null);
        if (user == null) {
            return ServiceErrors.userNotFoundFromTokenIdError();
        }
        // get the users isAdmin permission, if not admin, return error
        if (!user.getIsAdmin()) {
            return ServiceErrors.userAdminPermissionError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        try{

            // overwrite old cast in database (which is nothing since new movie)
            movie.setCast(movie.getCast());
            overwriteMovieDBCast(movie);
            // overwrite old directors in database (which is nothing since new movie)
            movie.setDirectors(movie.getDirectors());
            overwriteMovieDBDirectors(movie);
            // overwrite old genres in database (which is nothing since new movie)
            movie.setGenres(movie.getGenreString());
            overwriteMovieDBGenres(movie);

            Movie dbMovie = movieDAO.save(movie);

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
    public JSONObject  getMovieDetails(long id, String token) {

        // verify the users token
        Boolean tokenCheck = ServiceJWTHelper.verifyUserGetRequestToken(token, null);
        if (!tokenCheck) {
            return ServiceErrors.userTokenInvalidError();
        }

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
            returnMessage.put("runtime", dbMovie.getRuntime());
            returnMessage.put("genres", new JSONArray(dbMovie.getGenreListStr()));
            JSONArray reviewArray = new JSONArray();
            for (Review review : ServiceGetRequestHelperFunctions.getMovieReviewsByUserToken(userBlacklistDAO, dbMovie, token)) {
                if (review.getUser().getIsBanned()) continue;
                
                HashMap<String, Object> movieReview = new HashMap<String,Object>();
                movieReview.put("user", review.getUser().getId());
                movieReview.put("name", review.getUser().getName());
                movieReview.put("review", review.getReviewString());
                movieReview.put("rating", review.getRating());
                movieReview.put("likes", review.getLikes());
                JSONObject movieReviewJSON = new JSONObject(movieReview);
                reviewArray.put(movieReviewJSON);
            }
            returnMessage.put("reviews", reviewArray);
            returnMessage.put("averageRating", ServiceGetRequestHelperFunctions.getMovieAverageRatingByUserToken(userBlacklistDAO, dbMovie, token));
        }
        // otherwise if movie not found, return error
        else {
            return ServiceErrors.movieNotFoundError();
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;

    }
    public JSONObject higherOrLower() {
        int max = 444;
        int min = 1;
        Random num = new Random();
        int id = min + num.nextInt(max);
        Movie movie = movieDAO.findMovieByID(id);

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        returnMessage.put("name", movie.getName());
        returnMessage.put("year", movie.getYear());
        movie.recalculateAverageRating();
        returnMessage.put("averageRating", movie.getAverageRating());
        returnMessage.put("poster" , movie.getPoster());
        returnMessage.put("director", movie.getDirectors());
        returnMessage.put("cast", movie.getCast());

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;        

    }
    public JSONObject homepage(String token) {

        // verify the users token
        Boolean tokenCheck = ServiceJWTHelper.verifyUserGetRequestToken(token, null);
        if (!tokenCheck) {
            return ServiceErrors.userTokenInvalidError();
        }

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
                dbMovieDetails.put("genres", new JSONArray(movie.getGenreListStr()));
                dbMovieDetails.put("averageRating", ServiceGetRequestHelperFunctions.getMovieAverageRatingByUserToken(userBlacklistDAO, movie, token));

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
    public JSONObject searchMovieByName(SearchRequest searchRequest, String token) {

        // verify the users token
        Boolean tokenCheck = ServiceJWTHelper.verifyUserGetRequestToken(token, null);
        if (!tokenCheck) {
            return ServiceErrors.userTokenInvalidError();
        }

        if (!ServiceInputChecks.checkName(searchRequest.getName())) {
            return ServiceErrors.movieNameInvalidError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        JSONArray moviesArray = new JSONArray();

        List<Movie> dbMovies = movieDAO.searchMovieByName(searchRequest.getName());
        //Filter
        List<Movie> filteredMovies = dbMovies;

        if (searchRequest.getContentRating() != null && !searchRequest.getContentRating().isEmpty()) {
            List<String> inputContentRatingList = Arrays.asList(searchRequest.getContentRating().split(",[ ]*"));
            List<Movie> removeValues = new ArrayList<>();
            for (Movie m : filteredMovies) {
                if (!inputContentRatingList.contains(m.getContentRating())) removeValues.add(m);
            }
            filteredMovies.removeAll(removeValues);
        }
        //Filter the movies even more based on genre...
        if (searchRequest.getGenres() != null && !searchRequest.getGenres().isEmpty()) {
            List<String> inputGenreList = Arrays.asList(searchRequest.getGenres().split(",[ ]*"));
            List<Movie> removeValues = new ArrayList<>();
            for (Movie m : filteredMovies) {
                // if they are disjoint, they have no elements in common, so remove them from list
                if (!m.getGenreListStr().containsAll(inputGenreList)) removeValues.add(m);
            }
            filteredMovies.removeAll(removeValues);
        }

        // TODO: if valid movies are found (list of movies is larger than size 0)
        if (filteredMovies.size() > 0) {
            for(int i = 0; i < filteredMovies.size(); i++) {
                Movie dbMovie = filteredMovies.get(i);
                HashMap<String,Object> dbMovieDetails = new HashMap<String,Object>();
                dbMovieDetails.put("id", dbMovie.getId());
                dbMovieDetails.put("name", dbMovie.getName());
                dbMovieDetails.put("year", dbMovie.getYear());
                dbMovieDetails.put("poster", dbMovie.getPoster());
                dbMovieDetails.put("description", dbMovie.getDescription());
                dbMovieDetails.put("genres", new JSONArray(dbMovie.getGenreListStr()));
                dbMovieDetails.put("averageRating", ServiceGetRequestHelperFunctions.getMovieAverageRatingByUserToken(userBlacklistDAO, dbMovie, token));
                dbMovieDetails.put("contentRating", dbMovie.getContentRating());
                JSONObject dbMovieDetailsJson = new JSONObject(dbMovieDetails);
                moviesArray.put(dbMovieDetailsJson);
            }
        }
        returnMessage.put("movies", moviesArray);

        JSONArray actorsArray = new JSONArray();
        List<Actor> dbActors = actorDAO.searchActorByName(searchRequest.getName());
        for (Actor a : dbActors) {
            HashMap<String,Object> dbActorDetails = new HashMap<String,Object>();
            dbActorDetails.put("name", a.getName());
            dbActorDetails.put("id", a.getId());
            JSONObject dbActorDetailsJson = new JSONObject(dbActorDetails);
            actorsArray.put(dbActorDetailsJson);
        }
        returnMessage.put("actors", actorsArray);

        JSONArray directorsArray = new JSONArray();
        List<Director> dbdirectors = directorDAO.searchDirectorByName(searchRequest.getName());
        for (Director d : dbdirectors) {
            HashMap<String,Object> dbDirectordetails = new HashMap<String,Object>();
            dbDirectordetails.put("name", d.getName());
            dbDirectordetails.put("id", d.getId());
            JSONObject dbDirectordetailsJson = new JSONObject(dbDirectordetails);
            directorsArray.put(dbDirectordetailsJson);
        }
        returnMessage.put("directors", directorsArray);

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
    /**
     * Determines what movies are "trending"
     * The homepage has 12 movies on it.
     * @return
     */
    public List<Movie> trending() {
        //TODO: Write an algorithm which will find the trending movie's.
        List<Movie> movieList = movieDAO.trending();
        return movieList;
    }

    public JSONObject deleteMovie(DeleteMovieRequest request) {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        // verify the token and extract the users id
        Long user_id = ServiceJWTHelper.getTokenId(request.getToken(), null);
        if (user_id == null) {
            return ServiceErrors.userTokenInvalidError();
        }
        // get the user in database, check if found
        User user = userDAO.findById(user_id).orElse(null);
        if (user == null) {
            return ServiceErrors.userNotFoundFromTokenIdError();
        }
        // get the users isAdmin permission, if not admin, return error
        if (!user.getIsAdmin()) {
            return ServiceErrors.userAdminPermissionError();
        }


        // Delete movie from database by id.
        // Find the movie by id, clear all the sets from genre etc and then delete the movie
        Movie dbMovie = movieDAO.findMovieByID(request.getMovieId());
        if (dbMovie != null) {
            reviewDAO.deleteByMovie(dbMovie);
            movieDAO.deleteById(dbMovie.getId());
        } else {
            return ServiceErrors.movieNotFoundError();
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    public JSONObject editMovie(EditMovieRequest editMovieRequest) {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        // split request into components
        String token = editMovieRequest.getToken();
        long movieId = editMovieRequest.getMovieId();
        Movie editedMovieDetails = editMovieRequest.getMovie();

        // verify the token and extract the users id
        Long user_id = ServiceJWTHelper.getTokenId(token, null);
        if (user_id == null) {
            return ServiceErrors.userTokenInvalidError();
        }
        // get the user in database, check if found
        User user = userDAO.findById(user_id).orElse(null);
        if (user == null) {
            return ServiceErrors.userNotFoundFromTokenIdError();
        }
        // get the users isAdmin permission, if not admin, return error
        if (!user.getIsAdmin()) {
            return ServiceErrors.userAdminPermissionError();
        }

        // Find the movie by id, clear all the sets from genre etc and then delete the movie
        Movie dbMovie = movieDAO.findMovieByID(movieId);

        try{
            // overwrite movie details
            dbMovie.setName(editedMovieDetails.getName());
            dbMovie.setYear(editedMovieDetails.getYear());
            dbMovie.setPoster(editedMovieDetails.getPoster());
            dbMovie.setDescription(editedMovieDetails.getDescription());
            dbMovie.setContentRating(editedMovieDetails.getContentRating());
            dbMovie.setRuntime(editedMovieDetails.getRuntime());
            dbMovie.setTrailer(editedMovieDetails.getTrailer());

            // overwrite old cast in database
            dbMovie.setCast(editedMovieDetails.getCast());
            overwriteMovieDBCast(dbMovie);
            // overwrite old directors in database
            dbMovie.setDirectors(editedMovieDetails.getDirectors());
            overwriteMovieDBDirectors(dbMovie);
            // overwrite old genres in database
            dbMovie.setGenres(editedMovieDetails.getGenreString());
            overwriteMovieDBGenres(dbMovie);

            movieDAO.save(dbMovie);

        } catch(IllegalArgumentException e){
            return ServiceErrors.invalidInputError();
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    public JSONObject getAllGenres() {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        returnMessage.put("genres",  new JSONArray(Genre.genreCollectionToStrList(genreDAO.findAll())));
        return new JSONObject(returnMessage);
    }

    private void overwriteMovieDBCast(Movie dbMovie) {
        dbMovie.clearDBCast();
        String cast = dbMovie.getCast();
        if (!cast.isEmpty()) {
            // Change the cast to an array of strings.
            List<String> actorList = Arrays.asList(cast.split(",[ ]*"));
            // Make a new actor for each string
            for (String a: actorList) {
                // Check if the actor exists in the database first.
                if (actorDAO.findActorByName(a) != null) {
                    Actor dbActor = actorDAO.findActorByName(a);
                    dbMovie.addActorToCast(dbActor);
                } else {
                    Actor actor = new Actor(a);
                    actorDAO.save(actor);
                    dbMovie.addActorToCast(actor);
                }
            }
        }
    }

    private void overwriteMovieDBDirectors(Movie dbMovie) {
        dbMovie.clearDBDirectors();
        String directors = dbMovie.getDirectors();
        if (!directors.isEmpty()) {
            List<String> directorsList = Arrays.asList(directors.split(",[ ]*"));
            for (String d: directorsList) {
                if (directorDAO.findDirectorByName(d) != null) {
                    Director dbDirector = directorDAO.findDirectorByName(d);
                    dbMovie.addDirector(dbDirector);
                } else {
                    Director director = new Director(d);
                    directorDAO.save(director);
                    dbMovie.addDirector(director);
                }
            }
        }
    }

    private void overwriteMovieDBGenres(Movie dbMovie) {
        List<String> genres = dbMovie.getGenreString();
        if (!genres.isEmpty() && genres != null) {
            for (String g : genres) {
                Genre genre = new Genre(g);
                Genre dbGenre = genreDAO.findGenreByName(genre.getName());
                if (dbGenre != null) {
                    // This means the Genre is in the database, so it is a valid genre.
                    dbMovie.addGenreToDB(dbGenre);
                } else {
                    // Return an invalid input error.
                    throw new IllegalArgumentException();
                }
            }
        }
    }


}
