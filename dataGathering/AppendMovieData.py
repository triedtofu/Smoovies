# run this with different apiKey's and push to github after, should add movies to completeMovieData.csv and update sortedMovieByVotesWithCheck.csv

from __future__ import generator_stop
from asyncio.base_subprocess import WriteSubprocessPipeProto
from pdb import post_mortem
import requests
from sklearn.exceptions import PositiveSpectrumWarning
from sklearn.feature_selection import GenericUnivariateSelect
from pandas import DataFrame
import pandas as pd
import csv

# name,year,poster,trailer,description, contentRating
# call MDBList api with imdb id "tt___" and match json responses 

# directors, genres, cast
# call movieDetails api with imdb id "tt___" and match json responses

movieListPath = "sortedMovieByVotesWithCheck.csv"
outputPath = "completeMovieData.csv"

# change this for daily limits
apiKey = "1202e10ab1msh8a83f4ffdb0cafep12e0e3jsn3633742505d6"


movieList = pd.read_csv(movieListPath)

for index, row in movieList.iterrows():
	if row["check"] == 0:
		
		ttValue = row['tconst']
		print(ttValue)

		url = "https://mdblist.p.rapidapi.com/"
		querystring = {"i":ttValue}
		headers = {
			"X-RapidAPI-Key": apiKey,
			"X-RapidAPI-Host": "mdblist.p.rapidapi.com"
		}
		response = requests.request("GET", url, headers=headers, params=querystring)
		name = response.json()["title"]
		year = response.json()["year"]
		poster = response.json()["poster"]
		trailer = response.json()["trailer"]
		description =  response.json()["description"]
		contentRating =  response.json()["certification"]


		url = "https://movie-details1.p.rapidapi.com/imdb_api/movie"
		querystring = {"id":ttValue}
		headers = {
			"X-RapidAPI-Key": apiKey,
			"X-RapidAPI-Host": "movie-details1.p.rapidapi.com"
		}
		response = requests.request("GET", url, headers=headers, params=querystring)
		directors = response.json()["director_names"]
		genres = response.json()["genres"]
		actors = response.json()["actors"]

		# write everything into string
		directorsString = ""
		for director in directors:
			directorsString = directorsString + director + ','

		genresString = ""
		for genre in genres:
			genresString = genresString + genre + ','

		actorsString = ""
		for actor in actors:
			actorsString = actorsString + actor["name"] + ','

		# remove comma at end of string
		directorsString = directorsString[:-1]
		genresString = genresString[:-1]
		actorsString = actorsString[:-1]

		# append to completeMovieData csv file
		with open(outputPath,'a', newline='') as outputFile:
			writer = csv.writer(outputFile)
			writer.writerow([name,year,poster,trailer,description,directorsString,genresString,contentRating,actorsString])

		#update movieList csv file
		movieList.iloc[index,3] = 1
		movieList.to_csv(movieListPath, encoding='utf-8', index=False)
		
