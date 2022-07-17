package com.example.restservice.service;

import java.util.ArrayList;
//import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.restservice.dataModels.AuthenticationToken;
import com.example.restservice.dataModels.Movie;
import com.example.restservice.dataModels.ResetPasswordRequest;
import com.example.restservice.dataModels.RequestResetPasswordRequest;
import com.example.restservice.dataModels.User;
import com.example.restservice.dataModels.Genre;
import com.example.restservice.database.MovieDataAccessService;
import com.example.restservice.database.UserDataAccessService;

//import io.jsonwebtoken.Claims;


@Service
public class UserService {


    @Autowired
	private UserDataAccessService userDAO;

    @Autowired
    private MovieDataAccessService movieDAO;

    @Autowired
    private EmailSenderService emailSenderService;


    /**
     * Logs a user in based on their email and password.
     * @param email
     * @param password
     * @return userID, isAdmin, token
     */
    public JSONObject UserLogin(String email, String password) {

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        // checks inputs for errors (in terms of formatting)
        if (!ServiceInputChecks.checkEmail(email)) {
            return ServiceErrors.userEmailInvalidError();
        }
        // TODO: Should this check even be here? we dont need to check if the password is correct format when trying to login?
        // String error = ServiceInputChecks.checkPassword(password);
        // if (!error.equals("")) {
        //     return ServiceErrors.generateErrorMessage(error);
        // }

        // find the user in database by their email
        User user = userDAO.findUserByEmailPassword(email, password);
        // Check that the email exists in the database
        if (user == null) {
            return ServiceErrors.generateErrorMessage("The email and password you entered don't match");
        }
        //Password verification step
        // if (!password.equals(user.getPassword())) {
        //     return ServiceErrors.userPasswordIncorrectError();
        // }

        returnMessage.put("token", ServiceJWTHelper.generateJWT(user.getId().toString(), user.getEmail(), null));
        returnMessage.put("userId", user.getId());
        returnMessage.put("isAdmin", user.getIsAdmin());
        returnMessage.put("name", user.getName());

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    /**
     * Adds user to database
     * @param user
     * @param isAdmin
     * @return token, userID
     */
    public JSONObject register(User user, Boolean isAdmin) {
        if (!ServiceInputChecks.checkName(user.getName())) {
            return ServiceErrors.userNameInvalidError();
        } else if (!ServiceInputChecks.checkEmail(user.getEmail())) {
            return ServiceErrors.userEmailInvalidError();
        }

        String error = ServiceInputChecks.checkPassword(user.getPassword());
        if (!error.equals("")) {
            return ServiceErrors.generateErrorMessage(error);
        }

        if (!ServiceInputChecks.checkUniqueEmail(user.getEmail(), userDAO)) {
            return ServiceErrors.userEmailInUseError();
        }

        user.setIsAdmin(isAdmin);
        
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        try {
            // if user is successfully added, put user in dbUser
            // set return response values
            user = userDAO.saveUser(user.getEmail(), user.getPassword(), user.getName());

            returnMessage.put("token", ServiceJWTHelper.generateJWT(user.getId().toString(), user.getEmail()));
            returnMessage.put("userId", user.getId());
            returnMessage.put("name", user.getName());
        } catch(IllegalArgumentException e){
            return ServiceErrors.invalidInputError();
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    /**
     * Get list of all users from database
     * @return list of users
     */
    public List<User> getAllUsers() {
        return userDAO.findAll();
    }

    /**
     * Grabs the wishlist of a user
     * @param id
     * @return wishlist of user
     */
    public JSONObject getUserWishlist(long id) {

        // TODO: check id for errors
        if (!ServiceInputChecks.checkId(id)) {
            return ServiceErrors.userIdInvalidError();
        }

        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        // stores array of movies that are found by the search
        JSONArray moviesArray = new JSONArray();
        User user = userDAO.findById(id).orElse(null);

        if (user == null) return ServiceErrors.userIdInvalidError();

        Set<Movie> wishlist = user.getWishlistMovies();
        List<Movie> wish = new ArrayList<>(wishlist);
        //TODO: Sort alphabetically
        if (wishlist.size() > 0) {
            for(int i = 0; i < wishlist.size(); i++) {
                Movie dbMovie = wish.get(i);
                HashMap<String,Object> dbMovieDetails = new HashMap<String,Object>();
                dbMovieDetails.put("id", dbMovie.getId());
                dbMovieDetails.put("name", dbMovie.getName());
                dbMovieDetails.put("year", dbMovie.getYear());
                dbMovieDetails.put("poster", dbMovie.getPoster());
                dbMovieDetails.put("description", dbMovie.getDescription());
                dbMovieDetails.put("genres", new JSONArray(dbMovie.getGenreListStr()));

                JSONObject dbMovieDetailsJson = new JSONObject(dbMovieDetails);
                moviesArray.put(dbMovieDetailsJson);
            }
        }

        returnMessage.put("movies", moviesArray);
        returnMessage.put("username", user.getName());
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    /**
     * Updates the wishlist of a user
     * @param token
     * @param movieId
     * @param addRemove
     * @return {}
     */
    public JSONObject updateUserWishlist(AuthenticationToken token, long movieId, Boolean addRemove) {

        // TODO: check inputs for errors
        if (!ServiceInputChecks.checkId(movieId)) {
            return ServiceErrors.userIdInvalidError();
        }

        // verify the token and extract the users email
        Long user_id = ServiceJWTHelper.getTokenId(token.getToken(), null);
        if (user_id == null) {
            return ServiceErrors.userTokenInvalidError();
        }
        Movie movie = movieDAO.findById(movieId).get();
        User user = userDAO.findById(user_id).get();
        if (movie != null) {
            if (addRemove) {
                user.addToWishlist(movie);
                userDAO.save(user);
            } else {
                user.removeWishlist(movie);
                userDAO.save(user);
            }
        }
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    public JSONObject requestResetPassword(RequestResetPasswordRequest requestResetPasswordRequest) {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        User user = userDAO.findUserByEmail(requestResetPasswordRequest.getEmail());
        if (user == null) {
            return ServiceErrors.userEmailNotFoundError();
        } else {
            //send email
            // use the users current password as the signKey, this will allow the password to be reset once
            String link = "https://comp3900-lawnchair-front.herokuapp.com/resetPassword?token=" + ServiceJWTHelper.generateJWT(user.getId().toString(), user.getPassword(), ServiceJWTHelper.getResetSignKey());
            String subject = "Smoovies - Reset Password Request";
            String body = "To reset your password, please click " + link +". This link will expire in " + ServiceJWTHelper.tokenTimeInHours() + " hour(s).";
            emailSenderService.sendEmail(user.getEmail(), subject, body);
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    public JSONObject resetPassword(ResetPasswordRequest resetPasswordRequest) {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();

        // seperate request elements, resetCode is a token
        String token = resetPasswordRequest.getResetCode();
        String newPassword = resetPasswordRequest.getPassword();

        String tokenPassword = ServiceJWTHelper.getTokenSubject(token, ServiceJWTHelper.getResetSignKey());
        Long tokenUserId = ServiceJWTHelper.getTokenId(token, ServiceJWTHelper.getResetSignKey());
        // check that the user id and password in token exists, this will check that the token is valid as well
        if (tokenUserId == null || tokenPassword == null) {
            return ServiceErrors.resetCodeInvalidError();
        } 

        // check that the new password is valid
        String error = ServiceInputChecks.checkPassword(newPassword);
        if (!error.equals("")) {
            return ServiceErrors.generateErrorMessage(error);
        }
        
        // get the user corresponding to resetCode token
        Optional<User> optionalEntity = userDAO.findById(tokenUserId);
        User user = optionalEntity.get();
        // if not found, return error
        if(user == null) {
            return ServiceErrors.resetCodeInvalidError();
        } else {
            // if first time changing password, change password
            if (tokenPassword.equals(user.getPassword())) {
                // if its the same password, return error
                if (user.getPassword().equals(newPassword)) {
                    return ServiceErrors.resetPasswordIsTheSame();
                } else {
                    user.setPassword(resetPasswordRequest.getPassword());
                    userDAO.save(user);
                }
            }
            // otherwise return invalid link error
            else {
                return ServiceErrors.resetLinkInvalid();
            }
        }

        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

}
