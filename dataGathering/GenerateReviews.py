import requests
import json
import random

registerUrl = 'http://localhost:8080/api/user/register'
loginUrl = 'http://localhost:8080/api/user/login'
addReviewUrl = 'http://localhost:8080/api/movie/addReview'

reviewerRegister = {"name": "Jared Mcdonald", "email": "reviewer21@email.com", "password": "Password123"}
#reviewerLogin = {"email": "reviewer12@email.com", "password": "Password123"}
reviewerInfo = requests.post(registerUrl, json = reviewerRegister)  
#reviewerInfo = requests.post(loginUrl, json = reviewerLogin)
print(reviewerInfo.json())

review1 = "It's Morbin Time"
review2 = "It's Not Morbin Time"
review3 = "This is a dog movie don't watch it"
review4 = "I'm just leaving a review for the sake of leaving a review"
review5 = "I love writing reviews"
review6 = "Only smelly people like this movie"
review7 = "Only sexy people like this movie"
review8 = "Give me a refund on my movie ticket please"
review9 = "Best movie of all time"
review10 = "Worst movie of all time"
review11 = "I'm running out of ideas"
review12 = "I'm in love with the main character"
review13 = "I reckon I could've done a better fake accent"
review14 = "Director deserves an award"
review15 = "Looks like it was made for a HSC drama project"
review16 = "I just realised that these preset reviews may not correlate with the randomly generated ratings"
review17 = "The reviewer below is stupid"
review18 = "Review18"
review19 = "Almost there (Review19)"
review20 = "My work here is done"

reviewList = [review1, review2, review3, review4, review5, review6, review7, review8, review9, review10, 
              review11, review12, review13, review14, review15, review16, review17, review18, review19, review20]
for x in range(1, 45):
    review = {"token" : [], "movieId" : [], "review" : [], "rating" : []}
    review["token"] = (reviewerInfo.json())["token"]
    review["movieId"] = x
    review["review"] = reviewList[random.randint(0,19)]
    review["rating"] = random.randint(1,5)
    y = requests.post(addReviewUrl, json = review)

    if y.status_code == 200:
        print("Review", x, "added successfully")

    else:
        print("Could not add review")
    