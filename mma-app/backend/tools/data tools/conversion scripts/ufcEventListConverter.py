import csv
import os

'''

UFC EVENT LIST CONVERTER
Renames all of the event csv by adding the event number in front of the name

'''

UFC_EVENTS_DIR = "../data/UFC/UFC Events"
with open("../data/UFC/UFC_Event_List.csv", 'r') as ufcEventListCsv:
    csvReader = csv.DictReader(ufcEventListCsv)
    for row in csvReader:
        modifiedDate = modifiedDate = row["Date"].replace(' ', '')
        fileName = modifiedDate+".csv"
        csvFileNames = os.listdir(UFC_EVENTS_DIR)

        if fileName in csvFileNames:
            newFileName = row["Number"] + ","+fileName
            os.rename(UFC_EVENTS_DIR+"/"+fileName,
                      UFC_EVENTS_DIR+"/"+newFileName)
        else:
            print(fileName + " file not in directory")
