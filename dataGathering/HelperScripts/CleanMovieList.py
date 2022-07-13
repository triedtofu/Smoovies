## outputs all unique movies from the movie database in imdb to csv file
# input imdb database title.akas
import csv

movieDataPath = "Data/movieData.tsv"
outputPath = "cleanedMovieList.csv"

with open(outputPath,'w', newline='') as outputFile:
    writer = csv.writer(outputFile)
    with open(movieDataPath, encoding="utf8") as dataFile:
        movieData = csv.reader(dataFile, delimiter="\t",quoting=csv.QUOTE_NONE)
        for line in movieData:
            if line[7] == '1':
                writer.writerow(line)
            elif line[7] == 'isOriginalTitle':
                writer.writerow(line)
            