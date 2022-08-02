package com.example.restservice.service;

import java.util.ArrayList;
//import java.util.Collections;
import java.util.HashMap;
import java.util.List;
//import java.util.Optional;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.restservice.dataModels.AuthenticationToken;
import com.example.restservice.dataModels.Movie;
import com.example.restservice.dataModels.User;
import com.example.restservice.dataModels.UserBlacklist;
import com.example.restservice.dataModels.requests.BanUserRequest;
import com.example.restservice.dataModels.requests.BlacklistUserRequest;
import com.example.restservice.dataModels.requests.RequestResetPasswordRequest;
import com.example.restservice.dataModels.requests.ResetPasswordRequest;
import com.example.restservice.dataModels.requests.UpdateUserDetailsRequest;
//import com.example.restservice.dataModels.Genre;
import com.example.restservice.database.MovieDataAccessService;
import com.example.restservice.database.UserBlacklistDataAccessService;
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
    
    @Autowired
    private UserBlacklistDataAccessService userBlacklistDAO;
    
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
        
        // find the user in database by their email
        User user = userDAO.findUserByEmailPassword(email, password);
        
        // Check that the email exists in the database
        if (user == null) {
            return ServiceErrors.generateErrorMessage("The email and password you entered don't match");
        }
        
        // check the user is not banned
        if (user.getIsBanned()) {
            return ServiceErrors.userBannedError();
        }
        
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
    public JSONObject register(User user, Boolean isAdmin, Boolean isBanned) {
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
        user.setIsBanned(isBanned);
        
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        try {
            // if user is successfully added, put user in dbUser
            // set return response values
            
            user = userDAO.addNewUser(user.getEmail(), user.getIsAdmin(), user.getName(), user.getPassword());
            
            returnMessage.put("token", ServiceJWTHelper.generateJWT(user.getId().toString(), user.getEmail(), null));
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
    public JSONObject getUserWishlist(long id, String token) {
        // verify the users token
        if (token != null && !ServiceJWTHelper.verifyUserGetRequestToken(token, null)) {
            return ServiceErrors.userTokenInvalidError();
        }
        
        if (!ServiceInputChecks.checkId(id)) {
            return ServiceErrors.userIdInvalidError();
        }
        
        if (token != null) {
            // check that user is not trying to view a blacklisted users wishlist
            List<UserBlacklist> userBlacklist = userBlacklistDAO.findUserBlacklistById(ServiceJWTHelper.getTokenId(token, null));
            for (UserBlacklist blacklist: userBlacklist) {
                if (blacklist.getBlacklistedUserId() == id) return ServiceErrors.cannotViewBlacklistedUser();
            }
        }
        
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        // stores array of movies that are found by the search
        JSONArray moviesArray = new JSONArray();
        User user = userDAO.findById(id).orElse(null);
        if (user == null) return ServiceErrors.userIdInvalidError();
        
        // check the user is not banned
        if (user.getIsBanned()) {
            return ServiceErrors.userBannedError();
        }
        
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
                dbMovieDetails.put("averageRating", ServiceGetRequestHelperFunctions.getMovieAverageRatingByUserToken(userBlacklistDAO, dbMovie, token));
                
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
        
        if (!ServiceInputChecks.checkId(movieId)) {
            return ServiceErrors.userIdInvalidError();
        }
        // verify the token and extract the users id
        Long user_id = ServiceJWTHelper.getTokenId(token.getToken(), null);
        if (user_id == null) {
            return ServiceErrors.userTokenInvalidError();
        }
        
        Movie movie = movieDAO.findById(movieId).orElse(null);
        if (movie == null) return ServiceErrors.movieIdInvalidError();
        
        User user = userDAO.findById(user_id).orElse(null);
        if (user == null) return ServiceErrors.userNotFoundFromTokenIdError();
        
        // check the user is not banned
        if (user.getIsBanned()) {
            return ServiceErrors.userBannedError();
        }
        
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
        
        if (user == null) return ServiceErrors.userEmailNotFoundError();
        if (user.getIsBanned()) return ServiceErrors.userBannedError();
        
        // send email
        // use the users current password as the signKey, this will allow the password to be reset once
        String link = "https://comp3900-lawnchair-front.herokuapp.com/#/resetPassword?token=" + ServiceJWTHelper.generateJWT(user.getId().toString(), user.getPassword(), ServiceJWTHelper.getResetSignKey());
        String subject = "Smoovies - Reset Password Request";
        String body = "To reset your password, please click " + link +". This link will expire in " + ServiceJWTHelper.resetTokenTimeInHours() + " hour(s).";
        emailSenderService.sendEmail(user.getEmail(), subject, body);
        
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
        User user = userDAO.findById(tokenUserId).orElse(null);
        
        if (user == null) return ServiceErrors.userNotFoundFromTokenIdError();
        if (user.getIsBanned()) return ServiceErrors.userBannedError();
        
        // if first time changing password, change password
        if (tokenPassword.equals(user.getPassword())) {
            userDAO.updateUserPassword(user.getEmail(), newPassword);
        }
        // otherwise return invalid link error
        else {
            return ServiceErrors.resetLinkInvalid();
        }
        
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
    
    public JSONObject banUser(BanUserRequest banUserRequest) {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        
        // separate request components
        String token = banUserRequest.getToken();
        long userId = banUserRequest.getUserId();
        
        // verify the token and extract the admins id
        Long admin_id = ServiceJWTHelper.getTokenId(token, null);
        if (admin_id == null) {
            return ServiceErrors.userTokenInvalidError();
        }
        
        // get the user in database, check if found
        User admin = userDAO.findById(admin_id).orElse(null);
        if (admin == null) {
            return ServiceErrors.userNotFoundFromTokenIdError();
        }
        // get the admins isAdmin permission, if not admin, return error
        if (!admin.getIsAdmin()) {
            return ServiceErrors.userAdminPermissionError();
        }
        
        // check if userId to be banned is valid format
        if (!ServiceInputChecks.checkId(userId)) {
            return ServiceErrors.userIdInvalidError();
        }
        
        // get the user corresponding to userId to be banned
        User user = userDAO.findById(userId).orElse(null);
        if (user == null) {
            return ServiceErrors.userIdInvalidError();
        }
        // ban the user if not already banned
        if (user.getIsBanned()) {
            return ServiceErrors.userAlreadyBannedError();
        }
        
        user.setIsBanned(true);
        userDAO.save(user);
        
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
    
    public JSONObject blackListUser(BlacklistUserRequest blacklistUserRequest) {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        
        // seperate elements of the request
        String token = blacklistUserRequest.getToken();
        long blacklistedUserId = blacklistUserRequest.getUserId();
        Boolean addRemove = blacklistUserRequest.getAddRemove();
        
        // verify the token and extract the users id
        Long userId = ServiceJWTHelper.getTokenId(token, null);
        if (userId == null) {
            return ServiceErrors.userTokenInvalidError();
        }
        
        // check that both the user and user to be banned exist in db
        User user = userDAO.findById(userId).orElse(null);
        if (user == null) {
            return ServiceErrors.userNotFoundFromTokenIdError();
        }
        user = userDAO.findById(blacklistedUserId).orElse(null);
        if (user == null) {
            return ServiceErrors.userNotFound();
        }
        
        // if add, add to blacklist table
        if (addRemove) {
            UserBlacklist userBlacklist = userBlacklistDAO.findUserFromBlacklist(userId, blacklistedUserId);
            // add if user is not found inside blacklist already
            if (userBlacklist == null) {
                UserBlacklist newUserBlacklist = new UserBlacklist(userId, blacklistedUserId);
                userBlacklistDAO.save(newUserBlacklist);
            } else {
                return ServiceErrors.userAlreadyInBlacklist();
            }
        }
        // otherwise, remove from blacklist table
        else {
            UserBlacklist userBlacklist = userBlacklistDAO.findUserFromBlacklist(userId, blacklistedUserId);
            // remove if user is found inside blacklist
            if (userBlacklist != null) {
                userBlacklistDAO.deleteById(userBlacklist.getId());
            } else {
                return ServiceErrors.userNotFoundInBlacklist();
            }
        }
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
    
    public JSONObject getUserBlacklist(String token) {
        // verify the token and extract the users id
        Long user_id = ServiceJWTHelper.getTokenId(token, null);
        if (user_id == null) {
            return ServiceErrors.userTokenInvalidError();
        }
        
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        JSONArray blacklistArray = new JSONArray();
        
        List<UserBlacklist> userIdList = userBlacklistDAO.findUserBlacklistById(user_id);
        
        // find all users in blacklist and write in swagger format
        for (int i = 0; i < userIdList.size(); i ++) {
            User user = userDAO.findUserById(userIdList.get(i).getBlacklistedUserId());
            HashMap<String,Object> userDetails = new HashMap<String,Object>();
            
            userDetails.put("userId", user.getId());
            userDetails.put("username", user.getName());
            
            JSONObject userDetailsJson = new JSONObject(userDetails);
            
            blacklistArray.put(userDetailsJson);
        }
        
        // create the return message
        returnMessage.put("username", userDAO.findUserById(user_id).getName());
        returnMessage.put("users", blacklistArray);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
    
    /**
    *
    * @param token
    * @return The details of the user associated with the token
    */
    public JSONObject getUserDetails(String token) {
        // verify the token and extract the users id
        Long user_id = ServiceJWTHelper.getTokenId(token, null);
        if (user_id == null) return ServiceErrors.userTokenInvalidError();
        
        User user = userDAO.findById(user_id).orElse(null);
        if (user == null) return ServiceErrors.userNotFound();
        
        HashMap<String, Object> returnMessage = new HashMap<>();
        returnMessage.put("name", user.getName());
        returnMessage.put("email", user.getEmail());
        
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
    
    public JSONObject updateUserDetails(UpdateUserDetailsRequest updateUserDetailsRequest) {
        // verify the token and extract the users id
        Long user_id = ServiceJWTHelper.getTokenId(updateUserDetailsRequest.getToken(), null);
        if (user_id == null) return ServiceErrors.userTokenInvalidError();
        
        User user = userDAO.findById(user_id).orElse(null);
        if (user == null) return ServiceErrors.userNotFound();
        
        String email = updateUserDetailsRequest.getEmail();
        
        if (email != null) {
            if (!ServiceInputChecks.checkEmail(email)) return ServiceErrors.userEmailInvalidError();
            
            if (!email.equals(user.getEmail()) && !ServiceInputChecks.checkUniqueEmail(email, userDAO)) {
                return ServiceErrors.userEmailInUseError();
            }
            
            user.setEmail(email);
        }
        
        String username = updateUserDetailsRequest.getName();
        
        if (username != null) {
            if (!ServiceInputChecks.checkName(username)) return ServiceErrors.userNameInvalidError();
            
            user.setName(username);
        }
        
        String oldPassword = updateUserDetailsRequest.oldPassword();
        String password = updateUserDetailsRequest.getPassword();
        
        if (password != null) {
            if (oldPassword == null)
            return ServiceErrors.generateErrorMessage("Old password is null");
            
            String error = ServiceInputChecks.checkPassword(user.getPassword());
            if (!error.equals("")) return ServiceErrors.generateErrorMessage(error);
            
            if (!user.getPassword().equals(oldPassword))
            return ServiceErrors.generateErrorMessage("Old password is incorrect");
            
            user.setPassword(password);
        }
        
        userDAO.save(user);
        
        JSONObject responseJson = new JSONObject();
        return responseJson;
    }
}
