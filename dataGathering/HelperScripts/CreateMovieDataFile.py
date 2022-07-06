# creates the base file for the complete data file which we will use for in our database

import csv

outputPath = "completeMovieData.csv"

with open(outputPath,'w', newline='') as outputFile:
    writer = csv.writer(outputFile)
    writer.writerow(["name","year","poster","trailer","description","directors","genres","contentRating","cast"])