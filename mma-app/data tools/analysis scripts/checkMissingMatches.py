import csv
import os

with open("../data/UFC/UFC_Event_List.csv") as ufcEventList:
    csvReader = csv.DictReader(ufcEventList)
    eventListDateSet = set()
    
    for row in csvReader:
        modifiedDate = row["Date"].replace(' ','')
    
        if modifiedDate in eventListDateSet:
            print(modifiedDate + " is a duplicate event list date")
            
        eventListDateSet.add(modifiedDate) 
    
    csvMatchFiles =  os.listdir("../data/UFC/UFC Events")

    for matchFile in csvMatchFiles:
        matchFileDate = matchFile.split('.')[0]
        if matchFileDate not in eventListDateSet:
            print(matchFileDate + " not in UFC Event List")
    