package com.example.restservice.service;

import java.util.HashMap;
import java.util.Set;

import org.json.JSONObject;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.restservice.dataModels.Actor;
import com.example.restservice.dataModels.Movie;
import com.example.restservice.database.ActorDataAccessService;
@Service
public class ActorService {
    @Autowired
    private ActorDataAccessService actorDAO;

    /**
     * Returns an actor and all their movies
     * @param id
     * @return
     */
    public JSONObject getActor(Long id) {
        HashMap<String, Object> returnMessage = new HashMap<String,Object>();
        
        //Check actor id.
        if (!ServiceInputChecks.checkId(id)) return ServiceErrors.generateErrorMessage("Invalid actor Id");

        Actor actor = actorDAO.findActorById(id);
        if (actor == null) return ServiceErrors.generateErrorMessage("No actor exists with the given ID");

        returnMessage.put("name", actor.getName());
        Set<Movie> movies = actor.getMovieActorsIn();
        JSONArray movieArray = new JSONArray();
        for (Movie movie : movies) {
            HashMap<String,Object> dbMovieDetails = new HashMap<String,Object>();
            dbMovieDetails.put("id", movie.getId());
            dbMovieDetails.put("name", movie.getName());
            dbMovieDetails.put("year", movie.getYear());
            dbMovieDetails.put("poster", movie.getPoster());
            dbMovieDetails.put("description", movie.getDescription());
            dbMovieDetails.put("genres", new JSONArray(movie.getGenreListStr()));
            dbMovieDetails.put("averageRating", movie.getAverageRating());
            JSONObject movieJsonObject = new JSONObject(dbMovieDetails);
            movieArray.put(movieJsonObject);
        }
        returnMessage.put("movies", movieArray);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
}
