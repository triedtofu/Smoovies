package com.example.restservice.dataModels;
import com.fasterxml.jackson.annotation.JsonProperty;

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

    


