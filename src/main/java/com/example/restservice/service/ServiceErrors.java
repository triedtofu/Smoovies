package com.example.restservice.service;

import org.json.JSONObject;

import java.util.HashMap;

public class ServiceErrors {

    /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid input"}
     */
    public static JSONObject invalidInputError() {
        return generateErrorMessage("Invalid input");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Not found"}
     */
    public static JSONObject notFoundError() {
        return generateErrorMessage("Not found");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid token"}
     */
    public static JSONObject invalidTokenError() {
        return generateErrorMessage("Invalid token");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid name"}
     */
    public static JSONObject invalidNameError() {
        return generateErrorMessage("Invalid name");
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid email"}
     */
    public static JSONObject invalidEmailError() {
        return generateErrorMessage("Invalid email");
    }

     /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid password"}
     */
    public static JSONObject invalidPasswordError() {
        return generateErrorMessage("Invalid password");
    }
   
    /**
     * Returns JSONObject with error message
     * @return {"error": "Email already in use"}
     */
    public static JSONObject invalidUniqueEmailError() {
        return generateErrorMessage("Email already in use");
    }

    private static JSONObject generateErrorMessage(String error) {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        returnMessage.put("error", error);
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

}
