package com.example.restservice.api;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.json.JSONObject;

import com.example.restservice.service.ServiceErrors;

import java.util.List;
import java.util.ArrayList;

public class ControllerResponses {

    // generates a http response code based on response
    public static ResponseEntity<Object> generateHttpResponse (JSONObject response) {
        if(response.has("error")){
            if (checkBadRequest(response)) {
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            } else if (checkNotFound(response)) {
                return new ResponseEntity<Object>(response.toString(), HttpStatus.NOT_FOUND);
            } else if (checkForbidden(response)) {
                return new ResponseEntity<Object>(response.toString(), HttpStatus.FORBIDDEN);
            }
            return new ResponseEntity<Object>(response.toString(), HttpStatus.METHOD_NOT_ALLOWED);
        } else {
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
        }
    }

    // checks if response is a 400 BAD_REQUEST request
    private static Boolean checkBadRequest(JSONObject response) {
        
        String responseError = response.toString();
        List<String> errorList = new ArrayList<>();

        errorList.add(ServiceErrors.invalidInputError().toString());
        errorList.add(ServiceErrors.userTokenInvalidError().toString());
        errorList.add(ServiceErrors.userNameInvalidError().toString());
        errorList.add(ServiceErrors.movieNameInvalidError().toString());
        errorList.add(ServiceErrors.userEmailInvalidError().toString());
        errorList.add(ServiceErrors.userPasswordInvalidError().toString());
        errorList.add(ServiceErrors.movieIdInvalidError().toString());
        errorList.add(ServiceErrors.userIdInvalidError().toString());

        for(int i = 0; i < errorList.size(); i ++ ) {
            if (responseError.equals(errorList.get(i))) {
                return true;
            }
        }
        return false;

    }

    // checks if response is a 403 FORBIDDEN request
    private static Boolean checkForbidden(JSONObject response) {
    
        String responseError = response.toString();
        List<String> errorList = new ArrayList<>();

        errorList.add(ServiceErrors.userPasswordIncorrectError().toString());
        errorList.add(ServiceErrors.userEmailInUseError().toString());
        errorList.add(ServiceErrors.userAdminPermissionError().toString());

        for(int i = 0; i < errorList.size(); i ++ ) {
            if (responseError.equals(errorList.get(i))) {
                return true;
            }
        }
        return false;
    }

    // checks if response is a 404 NOT_FOUND request
    private static Boolean checkNotFound(JSONObject response) {

        String responseError = response.toString();
        List<String> errorList = new ArrayList<>();

        errorList.add(ServiceErrors.userEmailNotFoundError().toString());
        errorList.add(ServiceErrors.movieNotFoundError().toString());
        errorList.add(ServiceErrors.movieTrendingEmptyError().toString());
        errorList.add(ServiceErrors.UserWishlistNotFoundError().toString());

        for(int i = 0; i < errorList.size(); i ++ ) {
            if (responseError.equals(errorList.get(i))) {
                return true;
            }
        }
        return false;

    }
}
