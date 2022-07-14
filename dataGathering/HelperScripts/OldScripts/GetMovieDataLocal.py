## half of this is local search (directors,genres,cast), takes too long, dont use this unless necessary

from __future__ import generator_stop
from asyncio.base_subprocess import WriteSubprocessPipeProto
from pdb import post_mortem
import requests
from sklearn.exceptions import PositiveSpectrumWarning
from sklearn.feature_selection import GenericUnivariateSelect
from pandas import DataFrame
import pandas as pd

# name,year,poster,trailer,description, contentRating
# call api with imdb id "tt___" and match json responses 

# directors
# search imdb database title.principles with imdb id "tt______" for all director id's "nm______" 
# match director id "nm_______" with imdb database name.basics

# genres
# search imdb database title.basics with imdb id "tt____" for genres

# cast (actors)
# search imdb database title.principles with imdb id "tt______" for all actor id's "nm______" 
# match actor id "nm_______" with imdb database name.basics



movieListPath = "tempMovieList.csv"
outputPath = "completeMovieData.csv"
titlePrinciplesPath = "Data/movieCast.tsv"
titleBasicsPath = "Data/movieBasicData.tsv"
nameBasicsPath = "Data/actorData.tsv"

# movieList_df = pd.read_csv(movieListPath)


ttValue = "tt0111161"

print("Reading csv files...........")
cast_df = pd.read_csv(titlePrinciplesPath, sep='\t')
nameBasics_df = pd.read_csv(nameBasicsPath, sep='\t')
titleBasics_df = pd.read_csv(titleBasicsPath, sep='\t')
print("Finished reading csv files...........")


directorsString = ""
actorsString = ""
genresString = ""

print("Searching through db.......")
# director and actors
cast = cast_df[cast_df['tconst'].str.contains(ttValue)]


directors = cast[cast['category'].str.contains("director")]
actors = cast[cast['category'].str.contains("actor|actress|self")]

for index, row in actors.iterrows():
	actor = nameBasics_df[nameBasics_df['nconst'].str.contains(row["nconst"])]
	for index2, row2 in actor.iterrows():
		actorsString = actorsString + row2["primaryName"] + ","

for index, row in directors.iterrows():
	director = nameBasics_df[nameBasics_df['nconst'].str.contains(row["nconst"])]
	for index2, row2 in director.iterrows():
		directorsString = directorsString + row2["primaryName"] + ","

# genres
title = titleBasics_df[titleBasics_df['tconst'].str.contains(ttValue)]
for index, row in title.iterrows():
	genresString = genresString + row["genres"] + ","

print("Finished searching through db.......")

# remove the "," at the end
actorsString = actorsString[:-1]
directorsString = directorsString[:-1]
genresString = genresString[:-1]

print(actorsString)
print(directorsString)
print(genresString)

# url = "https://mdblist.p.rapidapi.com/"

# querystring = {"i":"tt0073195"}

# headers = {
# 	"X-RapidAPI-Key": "1202e10ab1msh8a83f4ffdb0cafep12e0e3jsn3633742505d6",
# 	"X-RapidAPI-Host": "mdblist.p.rapidapi.com"
# }

# response = requests.request("GET", url, headers=headers, params=querystring)


# name = response.json()["title"]
# year = response.json()["year"]
# poster = response.json()["poster"]
# trailer = response.json()["trailer"]
# description =  response.json()["description"]
# contentRating =  response.json()["certification"]


