package com.example.restservice.service;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import io.jsonwebtoken.*;
import java.util.Date;    

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;


// code taken and modified from 
// Source : https://medium.com/beingcoders/implement-jwt-token-in-9-minutes-1d579ff9731d
public class ServiceJWTHelper {

    private static String defaultSignKey = "sercretKeyMustBeThisLonggggggggggggggggggggggggggggg";
    private static String resetSignKey = "reset";

    //Sample method to construct a JWT
    public static String generateJWT(String id, String subject, String signKey) {
        
        long ttlMillis = tokenTimeInMilliSeconds();

        //The JWT signature algorithm we will be using to sign the token
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
    
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        //We will sign our JWT with our ApiKey secret
        byte[] apiKeySecretBytes;
        if (signKey != null) {
            // if sign key isnt long enough, pad it 
            signKey = padSignKey(signKey);
            apiKeySecretBytes = DatatypeConverter.parseBase64Binary(signKey);
        } else {
            apiKeySecretBytes = DatatypeConverter.parseBase64Binary(defaultSignKey);
        }
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());
    
        //Let's set the JWT Claims
        JwtBuilder builder = Jwts.builder().setId(id)
                                    .setIssuedAt(now)
                                    .setSubject(subject)
                                    .signWith(signingKey, signatureAlgorithm);
    
        //if it has been specified, let's add the expiration
        if (ttlMillis >= 0) {
        long expMillis = nowMillis + ttlMillis;
            Date exp = new Date(expMillis);
            builder.setExpiration(exp);
        }
    
        //Builds the JWT and serializes it to a compact, URL-safe string
        return builder.compact();
    }

    //Sample method to validate and read the JWT
    private static Claims verifyJWT(String jwt, String signKey) {
    
        //This line will throw an exception if it is not a signed JWS (as expected)
        try {
            Claims claims;
            if (signKey != null) {
                // if sign key isnt long enough, pad it 
                signKey = padSignKey(signKey);
                claims = Jwts.parserBuilder()         
                .setSigningKey(DatatypeConverter.parseBase64Binary(signKey))
                .build()
                .parseClaimsJws(jwt).getBody();
            } else {
                claims = Jwts.parserBuilder()         
                .setSigningKey(DatatypeConverter.parseBase64Binary(defaultSignKey))
                .build()
                .parseClaimsJws(jwt).getBody();
            }
            return claims;
        } catch (JwtException e) {
            return null;
        }
    }

    private static long tokenTimeInMilliSeconds() {
        // currently 1 hr
        return 60 * 60 * 1000; 
    }

    public static long tokenTimeInHours() {
        // currently 1 hr
        return tokenTimeInMilliSeconds()/60/60/1000; 
    }

    public static String getTokenSubject(String jwt, String signKey) {
        Claims claims = verifyJWT(jwt, signKey);
        if (claims != null) {
            return claims.getSubject();
        }
        return null;
        
    }

    /**
     *  Checks that a users token is valid on GET request
     * @param jwt
     * @param signKey
     * @return true if valid
     */
    public static Boolean verifyUserGetRequestToken(String jwt, String signKey) {
        // case where no token (e.g not logged in)
        if (jwt == null) {
            return true;
        }
        // case where logged in
        Claims claims = verifyJWT(jwt, signKey);
        if (claims != null) {
            return true;
        }
        return false;
    }

    public static Long getTokenId(String jwt, String signKey) {

        Claims claims = verifyJWT(jwt, signKey);
        if (claims != null) {
            return Long.valueOf(claims.getId());
        }
        return null;
    }

    public static String getResetSignKey() {
        return resetSignKey;
    }

    // pads the sign key to 50 characters with all "a" to the right
    private static String padSignKey(String signKey) {
        if (signKey.length() < 50) {
            signKey = String.format("%-50s", signKey ).replace(' ', 'a');
        }
        return signKey;
    }
}
