package com.example.restservice.service;

import java.util.HashMap;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.restservice.dataModels.Director;
import com.example.restservice.dataModels.Movie;
import com.example.restservice.database.DirectorDataAccessService;
import com.example.restservice.database.UserBlacklistDataAccessService;

@Service
public class DirectorService {
    @Autowired
    private DirectorDataAccessService directorDAO;
    
    @Autowired
    private UserBlacklistDataAccessService userBlacklistDAO;
    /**
     * Returns and actor and all their movies.
     * @param id
     * @param token
     * @return
     */
    public JSONObject getDirector(Long id, String token) {

        // verify the users token
        Boolean tokenCheck = ServiceJWTHelper.verifyUserGetRequestToken(token, null);
        if (!tokenCheck) {
            return ServiceErrors.userTokenInvalidError();
        }

        HashMap<String, Object> returnMessage = new HashMap<String,Object>();
        if (!ServiceInputChecks.checkId(id)) return ServiceErrors.generateErrorMessage("Invalid Director ID");
        Director director = directorDAO.findDirectorById(id);
        returnMessage.put("name", director.getName());
        Set<Movie> movies = director.getDirectorIsIn();
        JSONArray movieArray = new JSONArray();
        for (Movie movie : movies) {
            HashMap<String,Object> dbMovieDetails = new HashMap<String,Object>();
            dbMovieDetails.put("id", movie.getId());
            dbMovieDetails.put("name", movie.getName());
            dbMovieDetails.put("year", movie.getYear());
            dbMovieDetails.put("poster", movie.getPoster());
            dbMovieDetails.put("description", movie.getDescription());
            dbMovieDetails.put("genres", new JSONArray(movie.getGenreListStr()));
            dbMovieDetails.put("averageRating", ServiceGetRequestHelperFunctions.getMovieAverageRatingByUserToken(userBlacklistDAO, movie, token));
            JSONObject movieJsonObject = new JSONObject(dbMovieDetails);
            movieArray.put(movieJsonObject);
        }
        returnMessage.put("movies", movieArray);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
}
