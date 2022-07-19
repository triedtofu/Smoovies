package com.example.restservice.service;

import org.json.JSONObject;

import java.util.HashMap;

public class ServiceErrors {


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                  //
    //                                       Http 400 BAD_REQUEST errors                                //
    //                                                                                                  //
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 

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
    * @return {"error": "Invalid password"}
    */
   public static JSONObject userPasswordInvalidError() {
       return generateErrorMessage("Invalid password.");
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
     * @return {"error": "User Id is invalid."}
     */
    public static JSONObject userIdInvalidError() {
        return generateErrorMessage("User Id is invalid.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid reset code."}
     */
    public static JSONObject resetCodeInvalidError() {
        return generateErrorMessage("Invalid reset code.");
    }

    public static JSONObject reviewAlreadyExistsError() {
        return generateErrorMessage("A user is unable to add 2 reviews to a movie");
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                  //
    //                                       Http 403 FORBIDDEN errors                                  //
    //                                                                                                  //
    //////////////////////////////////////////////////////////////////////////////////////////////////////  

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
     * @return {"error": "This reset link is no longer valid, please make a new request."}
     */
    public static JSONObject resetLinkInvalid() {
        return generateErrorMessage("This reset link is no longer valid, please make a new request.");
    }
    
    /**
     * Returns JSONObject with error message
     * @return {"error": "New password can not be same as old password."}
     */
    public static JSONObject resetPasswordIsTheSame() {
        return generateErrorMessage("New password can not be same as old password.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "User is already banned."}
     */
    public static JSONObject userAlreadyBannedError() {
        return generateErrorMessage("User is already banned.");
    }

     /**
     * Returns JSONObject with error message
     * @return {"error": "User is banned."}
     */
    public static JSONObject userBannedError() {
        return generateErrorMessage("User is banned.");
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                  //
    //                                       Http 404 NOT_FOUND errors                                  //
    //                                                                                                  //
    //////////////////////////////////////////////////////////////////////////////////////////////////////  

    /**
     * Returns JSONObject with error message
     * @return {"error": "Email not found"}
     */
    public static JSONObject userEmailNotFoundError() {
        return generateErrorMessage("Email not found.");
    }

    public static JSONObject userNotFound() {
        return generateErrorMessage("User is not found");
    }

    public static JSONObject reviewNotFound() {
        return generateErrorMessage("No review has been found by the user to the requested movie");
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
     * @return {"error": "Trending movie list is empty."}
     */
    public static JSONObject movieTrendingEmptyError() {
        return generateErrorMessage("Trending movie list is empty.");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "User wishlist not found."}
     */
    public static JSONObject UserWishlistNotFoundError() {
        return generateErrorMessage("User wishlist not found.");
    }
    
    /**
     * Returns JSONObject with error message
     * @return {"error": "User not found, userId in token does not exist in database."}
     */
    public static JSONObject userNotFoundFromTokenIdError() {
        return generateErrorMessage("User not found, userId in token does not exist in database.");
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                  //
    //                                       Helper Functions                                           //
    //                                                                                                  //
    //////////////////////////////////////////////////////////////////////////////////////////////////////  

    public static JSONObject generateErrorMessage(String error) {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        returnMessage.put("error", error);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

}
