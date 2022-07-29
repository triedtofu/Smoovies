import requests
import json
import random

registerUrl = 'http://localhost:8080/api/user/register'
loginUrl = 'http://localhost:8080/api/user/login'
addReviewUrl = 'http://localhost:8080/api/movie/addReview'

reviewer = {"name": "Reviewer One", "email": "reviewer@email.com", "password": "Password123"}
reviewerInfo = requests.post(registerUrl, json = reviewer)  
print(reviewerInfo.json())
review1 = "It's Morbin Time"

for x in range(1, 450):
    review = {"token" : [], "movieId" : [], "review" : [], "rating" : []}
    review["token"] = (reviewerInfo.json())["token"]
    review["movieId"] = x
    review["review"] = review1
    review["rating"] = random.randint(0,5)
    x = requests.post(addReviewUrl, json = review)

    if x.status_code == 200:
        print("Review added successfully")

    else:
        print("Could not add review")
    