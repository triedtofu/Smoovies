package com.example.restservice.service;

import org.json.JSONObject;

import java.util.HashMap;

public class ServiceErrors {

    /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid input"}
     */
    public static JSONObject invalidInputError() {
        return generateErrorMessage("Invalid input.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid token"}
     */
    public static JSONObject userTokenInvalidError() {
        return generateErrorMessage("Invalid token.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid user name"}
     */
    public static JSONObject userNameInvalidError() {
        return generateErrorMessage("Invalid user name.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid movie name"}
     */
    public static JSONObject movieNameInvalidError() {
        return generateErrorMessage("Invalid movie name.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid email"}
     */
    public static JSONObject userEmailInvalidError() {
        return generateErrorMessage("Invalid email.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Email not found"}
     */
    public static JSONObject userEmailNotFoundError() {
        return generateErrorMessage("Email not found.");
    }

     /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid password"}
     */
    public static JSONObject userPasswordInvalidError() {
        return generateErrorMessage("Invalid password.");
    }

         /**
     * Returns JSONObject with error message
     * @return {"error": "Password is incorrect."}
     */
    public static JSONObject userPasswordIncorrectError() {
        return generateErrorMessage("Password is incorrect.");
    }
   
    /**
     * Returns JSONObject with error message
     * @return {"error": "Email is already in use"}
     */
    public static JSONObject userEmailInUseError() {
        return generateErrorMessage("Email is already in use.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "User is not an admin."}
     */
    public static JSONObject userAdminPermissionError() {
        return generateErrorMessage("User is not an admin.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Movie not found in database."}
     */
    public static JSONObject movieNotFoundError() {
        return generateErrorMessage("Movie not found in database.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Movie Id is invalid."}
     */
    public static JSONObject movieIdInvalidError() {
        return generateErrorMessage("Movie Id is invalid.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Trending movie list is empty."}
     */
    public static JSONObject movieTrendingEmptyError() {
        return generateErrorMessage("Trending movie list is empty.");
    }

     /**
     * Returns JSONObject with error message
     * @return {"error": "User Id is invalid."}
     */
    public static JSONObject userIdInvalidError() {
        return generateErrorMessage("User Id is invalid.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "User wishlist not found."}
     */
    public static JSONObject UserWishlistNotFoundError() {
        return generateErrorMessage("User wishlist not found.");
    }

    private static JSONObject generateErrorMessage(String error) {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        returnMessage.put("error", error);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

}
