package com.example.restservice.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.restservice.dataModels.Actor;
import com.example.restservice.database.ActorDataAccessService;
import com.example.restservice.database.UserBlacklistDataAccessService;
@Service
public class ActorService {
    @Autowired
    private ActorDataAccessService actorDAO;

    @Autowired
    private UserBlacklistDataAccessService userBlacklistDAO;
    
    /**
     * Returns an actor and all their movies
     * @param id
     * @return
     */
    public JSONObject getActor(Long id, String token) {

        // verify the users token
        Boolean tokenCheck = ServiceJWTHelper.verifyUserGetRequestToken(token, null);
        if (!tokenCheck) {
            return ServiceErrors.userTokenInvalidError();
        }
        //Check actor id.
        if (!ServiceInputChecks.checkId(id)) return ServiceErrors.generateErrorMessage("Invalid actor Id");

        Actor actor = actorDAO.findActorById(id);
        if (actor == null) return ServiceErrors.generateErrorMessage("No actor exists with the given ID");

        String requiredFields = "name, movies";
        return JSONObjectGenerators.actorObject(requiredFields, actor, userBlacklistDAO);
    }
}
