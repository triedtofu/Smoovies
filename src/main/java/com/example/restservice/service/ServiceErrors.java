package com.example.restservice.service;

import org.json.JSONObject;

import java.util.HashMap;

public class ServiceErrors {

    /**
     * Returns JSONObject with error message
     * @return {"error": "Invalid input"}
     */
    public static JSONObject invalidInputError() {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        returnMessage.put("error", "Invalid input");
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }

    /**
     * Returns JSONObject with error message
     * @return {"error": "Not found"}
     */
    public static JSONObject notFoundError() {
        HashMap<String,Object> returnMessage = new HashMap<String,Object>();
        returnMessage.put("error", "Not found");
        JSONObject responseJson = new JSONObject(returnMessage);
        return responseJson;
    }
}
