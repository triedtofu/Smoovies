import csv
import requests
import json

baseUrl = 'https://comp3900-lawnchair-front.herokuapp.com'

with open('completeMovieData.csv', newline='', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    movieData = list(reader)

addMovieUrl = baseUrl + '/api/movie/addMovie'
loginUrl = baseUrl + '/api/user/login'
admin = {"email": "admin@email.com", "password": "Admin123"}
adminInfo = requests.post(loginUrl, json = admin)
print(adminInfo.json())

count = 1
for movie in movieData:
    movieDict = {}
    movieDict["token"] = adminInfo.json()["token"]
    for i, data in enumerate(movie):
        if header[i] == "genres":
            movieDict["genres"] = data.split(",")
        else:
            movieDict[header[i]] = data

    movieDict['cast'] = ','.join(movieDict['cast'].split(',')[:3])

    # print("Movie is: ", movieDict)

    x = requests.post(addMovieUrl, json=movieDict)

    if x.status_code == 200:
      print(f"Added {movieDict['name']}")
    else:
      print(x.text)
      print(f"Could not add {movieDict['name']}")

    if count % 20 == 0:
      print(f"Added {count} movies")

    count += 1
