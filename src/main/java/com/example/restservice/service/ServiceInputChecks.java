package com.example.restservice.service;

import com.example.restservice.dataModels.Movie;

import java.text.CharacterIterator;
import java.text.StringCharacterIterator;
import java.util.*;
import java.util.regex.*;  
import java.util.Scanner;

public class ServiceInputChecks {

    // TODO: checks if id is valid format, true = valid
    public static Boolean checkId(long id) {
        return id > 0;
    }
    // TODO: checks if name is valid format, true = valid
    public static Boolean checkName(String name) {
        CharacterIterator it = new StringCharacterIterator(name);
        
        while (it.current() != CharacterIterator.DONE){
            if (((int)it.current() > 47 && (int)it.current() < 58) || ((int)it.current() > 64 && (int)it.current() < 91) || ((int)it.current() > 96 && (int)it.current() < 123)){
                it.next();
                continue;
            }
            else {
                return false;
            }
        }
        return true;
    }
    // Pattern Matching for Email Validation
    public static boolean patternMatches(String emailAddress, String regexPattern) {
        return Pattern.compile(regexPattern)
          .matcher(emailAddress)
          .matches();
    }
    // TODO: checks if email is valid format, true = valid
    public static Boolean checkEmail(String email) {
        String regexPattern = "^(.+)@(\\S+)$";
        return patternMatches(email, regexPattern);
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
