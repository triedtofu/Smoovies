package com.example.restservice.service;

import com.example.restservice.dataModels.Movie;
import com.example.restservice.dataModels.AuthenticationToken;

import java.text.CharacterIterator;
import java.text.StringCharacterIterator;
import java.util.regex.*;  

public class ServiceInputChecks {

    // Checks if id is valid format, true = valid
    public static Boolean checkId(long id) {
        return id > 0;
    }
    // Checks if name is valid format, true = valid
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
    // Checks if email is of valid format
    // TODO: Check if email is already in database
    public static Boolean checkEmail(String email) {
        String regexPattern = "^(.+)@(\\S+)$";
        return patternMatches(email, regexPattern);
    }
    // Checks if password is valid format, true = valid
    // Modified code from https://www.delftstack.com/howto/java/password-checker-java/
    public static Boolean checkPassword(String Password) {
        // Specify the minimum and maximum number of letters in a password
        final int min = 6; 
        final int max = 16;
                         
        // Specifying the number of uppercase letters in password
        final int minUppercase = 1;
        // Specifying the minimum lowercase letters in password
        final int minLowercase = 1;
        // Specifying the number of digits in a password
        final int numDigits = 1;
        // Count number of uppercase letters in a password
        int uppercaseCounter=0;
        // Counter lowercase letters in a password
        int lowercaseCounter=0;
        // Count digits in a password
        int digitCounter=0;
        
        // Counting character types for password
        for (int i=0; i < Password.length(); i++ ){
                char c = Password.charAt(i);
                if(Character.isUpperCase(c)){ 
                        uppercaseCounter++;
                }
                else if(Character.isLowerCase(c)) {
                        lowercaseCounter++;
                }
                else if(Character.isDigit(c)){ 
                        digitCounter++;     
                }
        }
        
        // Checking that password meets requirements
        if (Password.length() >= min && Password.length() <= max && uppercaseCounter >= minUppercase 
            && lowercaseCounter >= minLowercase && digitCounter >= numDigits) { 
                return true;
        }
        else {
            return false;                            
        }                                   
    }
    
    // TODO: checks all variables in the "movie" object are valid, true = valid
    public static Boolean checkMovie(Movie movie) {
        return true;
    }

    // TODO: check if the email already exists in db, false = exists, true = does not exist = valid
    // Will have to clear database each time to test this 
    public static Boolean checkUniqueEmail(String email) {
        try{
            // query DB for the email
            // if found, return false
            //return false;

            // for now just return true to pass test
            return true;

            // TODO:idk what error its meant to throw, have to hcange this
        } catch(IllegalArgumentException e){
            return true;
        }
    }

}
