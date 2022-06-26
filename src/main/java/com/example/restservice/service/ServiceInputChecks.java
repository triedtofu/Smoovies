package com.example.restservice.service;

import com.example.restservice.dataModels.Movie;

public class ServiceInputChecks {

    // TODO: checks if id is valid format, true = valid
    public static Boolean checkId(long id) {
        return true;
    }
    // TODO: checks if name is valid format, true = valid
    public static Boolean checkName(String name) {
        return true;
    }
    // TODO: checks if email is valid format, true = valid
    public static Boolean checkEmail(String email) {
        return true;
    }
    // TODO: checks if password is valid format, true = valid
    public static Boolean checkPassword(String Password) {
        return true;
    }
    // TODO: checks all variables in the "movie" object are valid, true = valid
    public static Boolean checkMovie(Movie movie) {
        return true;
    }

}
