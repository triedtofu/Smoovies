package com.example.restservice.dataModels;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "userblacklist")
public class UserBlacklist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "user_id")
    private long userId;
   
    @Column(name = "blacklisted_user_id")
    private long blacklistedUserId;

    public UserBlacklist() {
        super();
    }
    public UserBlacklist(long userId, long blacklistedUserId) {
        super();
        this.userId = userId;
        this.blacklistedUserId = blacklistedUserId;
    }

    public long getId() {
        return id;
    }

    public long getUserId() {
        return userId;
    }

    public long getBlacklistedUserId() {
        return blacklistedUserId;
    }

}







