import csv;

file = open('completeMovieData.csv')
csvreader = csv.reader(file)

header = []
header = next(csvreader)

rows = []
for row in csvreader:
    rows.append(row)


