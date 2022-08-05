package com.example.restservice.dataModels.requests;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class containing all fields for a request from REST API to reset password
 */
public class ResetPasswordRequest {
    
    private String resetCode;
    private String password;
    public ResetPasswordRequest(@JsonProperty("resetCode") String resetCode,
                                @JsonProperty("password") String password) {
        this.resetCode = resetCode;
        this.password = password;
    }

    public String getResetCode() {
        return resetCode;
    }

    public String getPassword() {
        return password;
    }

}

    


