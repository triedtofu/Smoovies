package com.example.restservice.api;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.json.JSONObject;

public class ControllerResponses {
    // receives inputs and returns output
    // responses are 200 ok, 400 invalid Input 
    public static ResponseEntity<Object> responseInputOnly (JSONObject response) {
        if(response.has("error")){
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
        }
    }

    // receives inputs and returns output after searching database
    // responses are 200 ok, 400 invalid Input, 404 not found
    public static ResponseEntity<Object> responseInputAndSearchDatabase(JSONObject response) {
        // TODO: test the error codes work properly
        if(response.has("error")){
            String error = response.getString("error");
            if (error.equals("Invalid input")) {
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            } else {
                return new ResponseEntity<Object>(response.toString(), HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
        }
    }

    // receives inputs and returns output after searching token list
    // responses are 200 ok, 400 invalid Input, 403 invalid token
    public static ResponseEntity<Object> responseInputAndSearchToken(JSONObject response) {
        // TODO: test the error codes work properly
        if(response.has("error")){
            String error = response.getString("error");
            if (error.equals("Invalid input")) {
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            } else {
                return new ResponseEntity<Object>(response.toString(), HttpStatus.FORBIDDEN);
            }
        } else {
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
        }
    }
}
