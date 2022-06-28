This file is to demonstrate the entities, relationship and constraints between the data based on the functional requirements of our movie finder.

Version: 1.0

**Requirement 1: Movie finders must be able to search for movies they are interested in
by keywords that match the movie name, description, or genre, with
listed results showing matching movie names, and their latest average
rating**

Object 1: Movie
 - name : string (Name of the movie)
 - description : string (Description of the movie)
 - movieId : int (primary key)

Object 2: User (Movie Finder)
 - name : string 
 - userId : int (primary key)
 - email : string (some sort of constraints here)
 - password : string 
 - username: string

Notes: Average ratings will be calculated after from the reviews?

Object 3: Actor
 - name: string (Describes the name of the actor) [Primary Key]

        These will map to the primary key of the Actor, and Movie object.
This structure will help make up the Cast of a movie, by querying the isIn object.

Object 4: ActorIsIn (Relationship object between movie and actor)

n:n relationship, actors can be in many movies, and a movie can have many actors.

 - actorId (foreign key)
 - movieId (foreign key) 

Object 5: Director 
 - directorId : int (primary key)
 - name: string 
 
Object: DirectorIsIn:
 - directorId: (foreign key)
 - movieId: (foreign key) 


Object 6: Reviews 

    Caution: and person can be both an actor and director. We want to know for a specific movie.
        
    Can't group them together otherwise we wont know if the person is a director or actor for a movie.
 - reviewId : int (primary key)
 - reviewer : string (foreign key to user)
 - rating : double 
 - description : string 
 - movieId : int (foreign key)

Object 7: Genre 

    (Seperated out as this can have multiple values and movies can be in alot of genres.)

- movieId (foreign key)
- genre : string (picked out of constraint)





**Requirement 2: Movie finders must be able to view the full details of any movie they
come across, including the movie name, description, genre, cast,
director, latest average rating, and all associated reviews. The full details
page for a given movie must also show recommendations for other
movies that are "similar", where such recommendations must be based
on at least review history, and a selection of multiple attributes that a
user can select (e.g., genre and/or director).**

     Notes: Logic for recommendations not done by database, will be done by backend.

**Requirement 3: Movie finders must be able to add any movie they come across on the
system to a wishlist of movies they would like to watch and must also be
able to remove movies from this wishlist.**

Object 7: Wishlist (Relationship between User and Movie)
    
    Not sure if this the best way to approach this. Envision a table of userId and MovieId, will have lots of entries. Also each entry will have a private boolean.
    
- userId (foreign key)
- movieId (foreign key)
- private (boolean) -> for private wish lists.

**Requirement 4: Movie finders must also be able to leave a review for any given movie
they browse to, where such a review includes text as well as a rating
from 0 to 5.**

    Covered by review object

**Requirement 5: Movie finders must also be able to view the wishlist of any other movie
finder that has left a review for a given movie.**
    
    No object needed.

**Requirement 6: The system must also allow movie finders to browse movies by director
or genre, with movies sorted from most popular to least popular based
on the movie average rating, and movies with an equal rating being
2
sorted alphabetically (movies with no rating would be treated as having
an average rating of 0).**
    
    No object needed.

**The system must also allow movie finders to add any review writer(s)
they wish to their "banned" list, meaning that the reviews written by the
banned review writer(s) will not be seen or influence the average rating
for the Movie Finder who banned the review writer(s).**

Object 8: Banned (Relationship object between 2 users.)

- userId (foreign key)
- userId (foreign key)
- banned (yes)

Logic can be either everytime someone new is added they have a relationship between ALL users defaulted as unbanned.

Or can just add user to user on this table.

    Not sure if thsi is the best way to approach this









