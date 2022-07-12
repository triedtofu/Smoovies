# Create a lookup table for principals, matches the tconst to the start row in title.principals
# Probably don't use this since the imdb numbers seem to jump significant figures

from pandas import DataFrame
import pandas as pd
import csv

titlePrinciplesPath = "Data/movieCast.tsv"
outputPath = "titlePrincipleLookupTable.csv"

print("Reading csv files...........")
df = pd.read_csv(titlePrinciplesPath, sep='\t')
print("Finished reading csv files...........")

with open(outputPath,'w', newline='') as outputFile:
    writer = csv.writer(outputFile)
    writer.writerow(["tconst", "startRow"])
    counter = 2
    for index, row in df.iterrows():
        if int(row['tconst'][2:]) != counter :
                if int(row['tconst'][2:]) > counter + 1:
                    while counter + 1 < int(row['tconst'][2:]):
                        writer.writerow([counter+1, "fakeEntry"])
                        counter += 1
                counter = int(row['tconst'][2:])
                writer.writerow([counter, index + 2])

    print("done")