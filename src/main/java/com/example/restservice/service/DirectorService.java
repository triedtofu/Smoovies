package com.example.restservice.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.restservice.dataModels.Director;
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
        if (!ServiceInputChecks.checkId(id)) return ServiceErrors.generateErrorMessage("Invalid Director ID");
        Director director = directorDAO.findDirectorById(id);
        String requiredFields = "name, movies";
        return JSONObjectGenerators.directorObject(requiredFields, director, userBlacklistDAO);
    }
}
