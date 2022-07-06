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

 
    //Sample method to construct a JWT
    public static String generateJWT(String id, String subject) {
        
        long ttlMillis = tokenTimeInMilliSeconds();

        //The JWT signature algorithm we will be using to sign the token
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
    
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
    
        //We will sign our JWT with our ApiKey secret
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary("sercretKeyMustBeThisLonggggggggggggggggggggggggggggg");
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
    private static Claims verifyJWT(String jwt) {
    
        //This line will throw an exception if it is not a signed JWS (as expected)
        try {
            Claims claims = Jwts.parserBuilder()         
            .setSigningKey(DatatypeConverter.parseBase64Binary("sercretKeyMustBeThisLonggggggggggggggggggggggggggggg"))
            .build()
            .parseClaimsJws(jwt).getBody();
            return claims;
        } catch (JwtException e) {
            return null;
        }
    }

    private static long tokenTimeInMilliSeconds() {
        // currently 1 hr
        return 60 * 60 * 1000; 
    }

    public static String getTokenEmail(String jwt) {
        Claims claims = verifyJWT(jwt);
        if (claims != null) {
            return claims.getSubject();
        }
        return null;
        
    }

    public static Long getTokenId(String jwt) {
        Claims claims = verifyJWT(jwt);
        if (claims != null) {
            return Long.valueOf(claims.getId());
        }
        return null;
    }
}
