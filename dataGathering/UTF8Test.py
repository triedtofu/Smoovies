import csv
import requests
import json

movieData = []
header = []
with open('completeMovieData.csv', newline='', encoding='utf-8') as f:
    
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        movieData.append(row)

counter = 0
    
addMovieUrl = 'http://localhost:8080/api/movie/addMovie' 
loginUrl = 'http://localhost:8080/api/user/login'
admin = {"email": "admin@email.com", "password": "Admin123"}
adminInfo = requests.post(loginUrl, json = admin)
print(adminInfo.json())

for i in movieData:
    movie = {"token": [], "name": [], "year": [], "poster": [], "trailer": [], "description": [], "director": [], "genres": [], "contentRating": [], "runTime": [], "cast": []}
    movie["token"] = (adminInfo.json())["token"]
    for j in i:
        #print("counter is:", counter)
        if header[counter] == "genres":
            list = j.split (",")
            #print("List is: ", list)
            for k in list:
                movie["genres"].append(k)
            #print("header[counter] is: ", header[counter]) 
            #print(movie["genres"])
        else:
            movie[header[counter]] = j    
        counter += 1
    #print("Movie is: ", movie)
    x = requests.post(addMovieUrl, json = movie)
    counter = 0
