# adds a check column to csv with all 0's

from pandas import DataFrame
import pandas as pd

inputPath = "sortedMovieByVotes.csv"
outputPath = "sortedMovieByVotesWithCheck.csv"

df = pd.read_csv(inputPath)

listofzeros = [0] * df.shape[0]

df["check"] = listofzeros       

df.to_csv(outputPath, encoding='utf-8', index=False)