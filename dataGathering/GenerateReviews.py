import requests
import json
import random

registerUrl = 'https://comp3900-lawnchair-front.herokuapp.com/api/user/register'
loginUrl = 'https://comp3900-lawnchair-front.herokuapp.com/api/user/login'
addReviewUrl = 'https://comp3900-lawnchair-front.herokuapp.com/api/movie/addReview'

reviewerRegister = {"name": "Sun Wukong", "email": "reviewer20@email.com", "password": "Password123"}
#reviewerLogin = {"email": "reviewer11@email.com", "password": "Password123"}
reviewerInfo = requests.post(registerUrl, json = reviewerRegister)  
#reviewerInfo = requests.post(loginUrl, json = reviewerLogin)
#print(reviewerInfo.json())

review1 = "Actors didnt do a good job in this movie. Send them back to acting school."
review2 = "Movie title is super misleading."
review3 = "The director has no direction in this movie. Felt like a sailor on land."
review4 = "Doesn't live up to the hype. I was honestly really disappointed."
review5 = "Only giving it 2 stars cause it has good actors."
review6 = "Story wasn't that interesting, fell asleep in the cinemas. Good soundtrack to fall asleep to though."
review7 = "Kind of generic, does nothing well but nothing too bad either."
review8 = "Not worth spending my weekend watching this."
review9 = "Movie was quite predicatble throughout. Somewhat enjoyed it but wouldnt give it a double take."
review10 = "Decent Movie. Disliked the main lead."
review11 = "Recommended by a friend but didnt really like it. Acting was bland and storyline was going around in circles but main actor was popular."   
review12 = "Ok movie. Terrible acting but visuals were great."
review13 = "Great movie even though the ending was predictable."
review14 = "Nice movie, but the ending was a bit confusing."
review15 = "Enjoyed this movie but I felt that the pacing was a little bit slow."
review16 = "The plot, soundtrack, and directing were all amazing, but I wish there was more diverse cultural representation."
review17 = "Absolute masterpiece of a movie. I've never seen such perfection and anything will ever compare."
review18 = "Best movie of all time. You can't change my mind."
review19 = "I wish I could watch this movie for the first time again."
review20 = "This movie is actually so good I've watched it 20 times."

reviewList1 = [review1, review2, review3, review4]
reviewList2 = [review5, review6, review7, review8]
reviewList3 = [review9, review10, review11, review12]
reviewList4 = [review13, review14, review15, review16]
reviewList5 = [review17, review18, review19, review20]

for x in range(1, 46):
    review = {"token" : [], "movieId" : [], "review" : [], "rating" : []}
    review["token"] = (reviewerInfo.json())["token"]
    review["movieId"] = x
    
    review["rating"] = random.randint(1,5)
    if (review["rating"] == 1):
        review["review"] = reviewList1[random.randint(0,3)]
    
    elif (review["rating"] == 2):
        review["review"] = reviewList2[random.randint(0,3)]
    
    elif (review["rating"] == 3):
        review["review"] = reviewList3[random.randint(0,3)]
    
    elif (review["rating"] == 4):
        review["review"] = reviewList4[random.randint(0,3)]
    
    elif (review["rating"] == 5):
        review["review"] = reviewList5[random.randint(0,3)]
    
    y = requests.post(addReviewUrl, json = review)

    if y.status_code == 200:
        print("Review", x, "added successfully")

    else:
        print("Could not add review")
    