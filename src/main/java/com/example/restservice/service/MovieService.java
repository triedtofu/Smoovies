package com.example.restservice.service;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
//import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
// import java.util.ArrayList;
// import java.util.Set;
// import java.util.Optional;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.transaction.Transactional;

import org.apache.commons.text.similarity.JaroWinklerDistance;
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
import com.example.restservice.dataModels.UserGenrePreferenceScore;
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
import com.example.restservice.database.UserGenrePreferenceScoreDataAccessService;

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

    @Autowired
    private UserGenrePreferenceScoreDataAccessService userGenrePreferenceScoreDataAccessService;

    private static final double DIRECTORWEIGHT = 0.15;
    private static final double ACTORWEIGHT = 0.15;
    private static final double NAMEWEIGHT = 0.20;
    private static final double GENREWEIGHT = 0.50;
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
        //if (token.isEmpty()) {return ServiceErrors.generateErrorMessage("weird token");}
        // verify the users token`
        Boolean tokenCheck = ServiceJWTHelper.verifyUserGetRequestToken(token, null);
        if (!tokenCheck) {
            return ServiceErrors.userTokenInvalidError();
        }

        if (!ServiceInputChecks.checkId(id)) {
            return ServiceErrors.movieIdInvalidError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        Movie dbMovie = movieDAO.findMovieByID(id);
        if (dbMovie == null) return ServiceErrors.movieNotFoundError();
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
        if (token != null) {
            Long user_id = ServiceJWTHelper.getTokenId(token, null);
            User user = userDAO.findUserById(user_id);
            reviewArray = ServiceHelperFunctions.reviewJSONArrayMovies(true, user, ServiceGetRequestHelperFunctions.getMovieReviewsByUserToken(userBlacklistDAO, dbMovie, token));
        }
        if (token == null) {
        List<Review> reviews = ServiceGetRequestHelperFunctions.getMovieReviewsByUserToken(userBlacklistDAO, dbMovie, token);
        
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
        }
        returnMessage.put("reviews", reviewArray);
        returnMessage.put("averageRating", ServiceGetRequestHelperFunctions.getMovieAverageRatingByUserToken(userBlacklistDAO, dbMovie, token));
        HashMap<Movie, Double> similarMovies = similarMovies(dbMovie);
        JSONArray similarMoviesArray = new JSONArray();
        for (Map.Entry<Movie,Double> entry : similarMovies.entrySet()) {
            HashMap<String,Object> similarMovieObject = new HashMap<String,Object>();
            Movie similarMovie = entry.getKey();
            similarMovieObject.put("name", similarMovie.getName());
            similarMovieObject.put("id", similarMovie.getId());
            similarMovieObject.put("year", similarMovie.getYear());
            similarMovieObject.put("poster", similarMovie.getPoster());
            similarMovieObject.put("similarityRating", entry.getValue());
            similarMoviesArray.put(new JSONObject(similarMovieObject));
        }
        returnMessage.put("similar", similarMoviesArray);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
    /**
     * Returns a list of movies that satisfy the given parameters
     * @param startYear
     * @param endYear
     * @param genres
     * @param contentRating
     * @return
     */
    public JSONObject higherOrLower(int startYear, int endYear, String genres, String contentRating) {
        HashMap<String, Object> returnMessage = new HashMap<>();
        List<Movie> allMovies = movieDAO.findAll();
        JSONArray movieDetailsArray = new JSONArray();

        List<String> genreList = null;

        if (genres != null) genreList = new ArrayList<>(Arrays.asList(genres.split(",[ ]*")));

        List<String> contentRatingList = null;

        if (contentRating != null) contentRatingList = new ArrayList<>(Arrays.asList(contentRating.split(",[ ]*")));

        for (Movie movie : allMovies) {
            Boolean movieHasGenre = false;
            HashMap<String, Object> movieDetails = new HashMap<String, Object>();
            // Checking that the current movie satisfies the user inputted filters. Skip iteration if not.
            if (movie.getAverageRating() == 0) continue;

            if (movie.getYear() < startYear || movie.getYear() > endYear) continue;

            if (genreList != null && !genres.isEmpty()) {
                //System.out.print("Genres is not null");
                List<String> movieGenres = movie.getGenreListStr();
                //System.out.println(Arrays.toString(movieGenres.toArray()));
                for (String genre : movieGenres) {
                    if (genreList.contains(genre)){
                        movieHasGenre = true;
                        break;
                    };
                }

                if (!movieHasGenre) continue;
            }

            if (contentRatingList != null && !contentRating.isEmpty() && !contentRatingList.contains(movie.getContentRating())){
                continue;
            }
            // Putting all the details into Hashmap, making it a JSON object, and putting it in the movie Array
            movieDetails.put("name", movie.getName());
            movieDetails.put("year", movie.getYear());
            movieDetails.put("averageRating", movie.getAverageRating());
            movieDetails.put("poster", movie.getPoster());
            movieDetails.put("director", movie.getDirectors());
            movieDetails.put("cast", movie.getCast());
            JSONObject movieDetailsJSON = new JSONObject(movieDetails);
            movieDetailsArray.put(movieDetailsJSON);
        }
        returnMessage.put("movies", movieDetailsArray);
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
        List<Movie> movies = new ArrayList<Movie>();
        // case where no token, return top rated (i.e user not logged in)
        if (token == null) {
            movies = this.topRated();
        } else {
            //Add in the recommendations for specific user
            long user_id = ServiceJWTHelper.getTokenId(token, null);
            movies = findRecommendedMovies(user_id);
        }
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
     * Searches the database based on a query, returns based on title and then description.
     * @param searchRequest
     * @param token
     * @return
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
        List<Movie> nameMovies = movieDAO.searchMovieByName(searchRequest.getName());
        List<Movie> descMovies = movieDAO.searchMovieByDescription(searchRequest.getName());


        List<Movie> dbMovies = new ArrayList<Movie>();
        
        for (Movie m: nameMovies) {
            dbMovies.add(m);
        }

        for (Movie m : descMovies) {
            if (!dbMovies.contains(m)) dbMovies.add(m);
        }
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
    /**
     * Given a movie returns a list of 4 Similar movies.
     * Algorithm will be weighted with the following parameters.
     * Weighted -
     * 55% similarity in the name
     * 25% similarity in genre - calculated % of genres it matches.
     * 10% simlarity in director - how many points per director it has.
     * 10% simlarity in actors - how many simlar actors does it have.
     * @param movie
     * @return
     */
    private HashMap<Movie, Double> similarMovies(Movie movie) {
        List<Movie> allMovies = movieDAO.findAll();
        allMovies.remove(movie);
        HashMap<Movie, Double> weightedSimilarities = new HashMap<Movie, Double>();
        //Put all the movies in the hashmap
        for (Movie dbMovie : allMovies) {
            //StringUtils.getJaroWinklerDistance()
            JaroWinklerDistance distance = new JaroWinklerDistance();
            double editDistance;
            if (movie.getName() != null){
                editDistance = distance.apply(dbMovie.getName(), movie.getName());
            } else {
                editDistance = 0;
            }

            double genreListSize = movie.getGenreList().size();
            double genreMatches = 0;
            for (Genre genre : movie.getGenreList()){
                if(genre.movieInGenre(dbMovie)) genreMatches++;
            }
            double genreDistance;
            if (genreListSize != 0) {
                genreDistance = genreMatches/genreListSize;
            } else {
                genreDistance = 0;
            }

            double actorListSize = movie.getActorsInMovie().size();
            double actorMatches = 0;
            for (Actor actor : movie.getActorsInMovie()) {
                if (actor.actorInMovie(dbMovie)) actorMatches++;
            }
            double actorDistance;
            if (actorListSize != 0) {
                actorDistance = actorMatches/actorListSize;
            } else {
                actorDistance = 0;
            }

            double directorListSize = movie.getDirectorsInMovie().size();
            double directorMatches = 0;
            for (Director director : movie.getDirectorsInMovie()) {
                if (director.directorIsInMovie(dbMovie)) directorMatches++;
            }
            double directorDistance;
            if (directorListSize != 0) {
                directorDistance = directorMatches/directorListSize;
            } else {
                directorDistance = 0;
            }
            //Calculate the similarity between dbmovie and given movie based on.
            double simlarity = directorDistance * DIRECTORWEIGHT + actorDistance * ACTORWEIGHT + editDistance * NAMEWEIGHT + genreDistance * GENREWEIGHT;

            weightedSimilarities.put(dbMovie, simlarity);
        }

        //Sort the movies in terms of similarity
        List<Map.Entry<Movie,Double>> list = new LinkedList<Map.Entry<Movie,Double>>(weightedSimilarities.entrySet());

        Collections.sort(list, new Comparator<Map.Entry<Movie, Double>>(){
            public int compare (Map.Entry<Movie, Double> o1, Map.Entry<Movie, Double> o2) {
                return (o1.getValue().compareTo(o2.getValue()));
            }
        });
        Collections.reverse(list);
        HashMap<Movie, Double> temp = new LinkedHashMap<Movie, Double>();
        int counter = 0;
        for (Map.Entry<Movie, Double> aa : list) {
            temp.put(aa.getKey(), aa.getValue());
            counter++;
            if (counter == 12) break;
        }
        return temp;
    }

    /**
     * Find recommended movies based on the genres of movies that the user has placed reviews on
     * @param user_id
     * @return
     */
    private List<Movie> findRecommendedMovies(Long user_id) {
        List<Movie> recommendedMoviesList = new ArrayList<>();

        // get all genres
        List<Genre> genresList = genreDAO.findAll();
        // get the users score on all genres
        HashMap<String, Long> usersGenreScores = new HashMap<String, Long>();
        for (Genre genre: genresList) {
            UserGenrePreferenceScore userGenrePreferenceScore = userGenrePreferenceScoreDataAccessService.findUserPreferenceScoreByGenreId(user_id, genre.getId());
            if (userGenrePreferenceScore != null) {
                usersGenreScores.put(genre.getName(), userGenrePreferenceScore.getScore());
            } else {
                usersGenreScores.put(genre.getName(), Long.valueOf(0));
            }
        }
        // find the users top 5 genres
        List<String> topUsersGenreScoresKeys = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            Long maxScore = Collections.max(usersGenreScores.values());
            for (Entry<String, Long> entry : usersGenreScores.entrySet()) {
                if (Long.valueOf(entry.getValue()).equals(maxScore)) {
                    topUsersGenreScoresKeys.add(entry.getKey());
                    usersGenreScores.remove(entry.getKey());
                    break;
                }
            }
        }
        // make a buffer movie to find "similar movies"
        Movie bufferMovie = new Movie();
        for (String genreName : topUsersGenreScoresKeys) {
            bufferMovie.addGenreToDB(genreDAO.findGenreByName(genreName));;
        }
        // get top 12 recommended movies
        HashMap<Movie, Double> recommendedMovies = similarMovies(bufferMovie);
        for (int i = 0; i < 12; i++) {
            Double maxSimilarity = Collections.max(recommendedMovies.values());
            for (Entry<Movie, Double> entry : recommendedMovies.entrySet()) {
                if (entry.getValue() == maxSimilarity) {
                    recommendedMoviesList.add(entry.getKey());
                    recommendedMovies.remove(entry.getKey());
                    break;
                }
            }
        }
        return recommendedMoviesList;
    }
    /**
     * Returns the 12 top rated movies that has more than 5 reviews.
     * @return
     */
    private List<Movie> topRated() {
        List<Movie> dbTopRated = movieDAO.topRated();
        List<Movie> topRated = new ArrayList<Movie>();
        int count = 0;
        for (Movie m : dbTopRated) {
            if (m.getMovieReviews().size() >= 5) {
                topRated.add(m);
                count++;
            }
            if (count == 12) {
                break;
            }
        }
        return topRated;
    }
}
