package com.example.restservice.dataModels;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
/**
 * Database table that maps a user, to a genre giving them a preference score for it.
 */
@Entity
@Table(name = "user_genre_preference_scores")
public class UserGenrePreferenceScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    
    @Column(name = "user_id")
    private long userId;

    @Column(name = "genre_id")
    private long genreId;

    @Column(name = "score")
    private long score;

    public UserGenrePreferenceScore() {
        super();
    }
    public UserGenrePreferenceScore(long userId, long genreId) {
        super();
        this.userId = userId;
        this.genreId = genreId;
        this.score = 0;
    }

    public long getUserId() {
        return userId;
    }

    public long getGenreId() {
        return genreId;
    }

    public long getScore() {
        return score;
    }
    /**
     * Updates the score for a user genre preference.
     * @param rating
     */
    public void updateScore(int rating) {
        double reviewScore = 0;
        if (rating > 0) {
            reviewScore = rating - 2.5;
        } else if (rating < 0) {
            reviewScore = rating + 2.5;
        }
        reviewScore *= 2;
        this.score += (long)reviewScore;
    }
}








