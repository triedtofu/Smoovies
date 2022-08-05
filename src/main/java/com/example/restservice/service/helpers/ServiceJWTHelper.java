package com.example.restservice.service.helpers;

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
    
    /**
     * Generates a JWT
     * @param id ID of the user
     * @param subject Subject to be encrypted in token
     * @param signKey secret signkey of the token
     * @return JWT token
     */
    public static String generateJWT(String id, String subject, String signKey) {
        
        
        //The JWT signature algorithm we will be using to sign the token
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
    
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        
        //We will sign our JWT with our ApiKey secret
        byte[] apiKeySecretBytes;
        long ttlMillis;
        if (signKey != null) {
            // if sign key isnt long enough, pad it 
            signKey = padSignKey(signKey);
            apiKeySecretBytes = DatatypeConverter.parseBase64Binary(signKey);
            ttlMillis = resetTokenTimeInMilliSeconds();
        } else {
            apiKeySecretBytes = DatatypeConverter.parseBase64Binary(defaultSignKey);
            ttlMillis = loginTokenTimeInMilliSeconds();
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
    /**
     * Veriy a jwt
     * @param jwt The jwt to verify
     * @param signKey The sign key to decode with
     * @return the claims of the jwt token, null if not valid jwt
     */
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

    /**
     * login token expiry time in ms
     */
    private static long loginTokenTimeInMilliSeconds() {
        // currently 1 month
        return 30 * 24 * 60 * 60 * 1000; 
    }
    
    /**
     * login token expiry time in hrs
     * @return expiry time
     */
    public static long loginTokenTimeInHours() {
        return loginTokenTimeInMilliSeconds()/60/60/1000; 
    }

    /**
     * reset token expiry time in ms
     * @return expiry time
     */
    private static long resetTokenTimeInMilliSeconds() {
            // currently 1 hour
            return 60 * 60 * 1000; 
    }

    /**
     * reset token expiry time in hrs
     * @return expiry time
     */
    public static long resetTokenTimeInHours() {
        return resetTokenTimeInMilliSeconds()/60/60/1000; 
    }

    /**
     * Gets the subject of a jwt
     * @param jwt the jwt to get subjecty from
     * @param signKey signkey to decrypt token with
     * @return subject of the jwt, null if invalid token
     */
    public static String getTokenSubject(String jwt, String signKey) {
        Claims claims = verifyJWT(jwt, signKey);
        if (claims != null) {
            return claims.getSubject();
        }
        return null;
        
    }

    /**
     *  Checks that a users token is valid on GET request
     * @param jwt jwt to verify
     * @param signKey signkey to decrypt token with
     * @return true if valid, false if not valid
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

    /**
     * Gets the id of a jwt
     * @param jwt jwt to verify
     * @param signKey signkey to decrypt token with
     * @return id of token, null if invalid token
     */
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

    /**
     * pads a sign key to 50 characters with all "a" to the right
     * @param signKey signkey to be padded
     * @return padded sign key
     */
    private static String padSignKey(String signKey) {
        if (signKey.length() < 50) {
            signKey = String.format("%-50s", signKey ).replace(' ', 'a');
        }
        return signKey;
    }
}
