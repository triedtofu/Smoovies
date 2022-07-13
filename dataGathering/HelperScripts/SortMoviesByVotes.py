# sorts data set of movies by number of votes (user giving a star rating) and outputs to csv
# input imdb database title.ratings

from pandas import DataFrame
import pandas as pd

movieRatingDataPath = "Data/movieRatings.tsv"
outputPath = "sortedMovieByVotes.csv"

df = pd.read_csv(movieRatingDataPath, sep='\t')

sorted_df = df.sort_values(["numVotes"], ascending=False)        

sorted_df.to_csv(outputPath, encoding='utf-8', index=False)