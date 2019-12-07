import csv
import json
import os

UFC_DIR = "../data/UFC"
EVENT_LIST_FILE = "UFC_Event_List.csv"

with open(UFC_DIR + "/" + EVENT_LIST_FILE, 'r', encoding="utf-8") as ufcEventListCsv:
    csvReader = csv.DictReader(ufcEventListCsv)
    jsonDict = {'Events': []}

    for row in csvReader:
        ufcEventsDir = UFC_DIR + "/UFC Events"
        eventSourceWikiLink = row["WikiLink"]
        eventDate = row["Date"]
        eventFileName = eventDate.replace(' ', '') + ".csv"
        eventFilePath = ufcEventsDir + "/" + eventFileName
        eventNumber = row["Number"]
        eventName = row["Name"]

        if not os.path.exists(eventFilePath):
            eventFilePath = ufcEventsDir + "/" + eventNumber + "," + eventFileName

            if not os.path.exists(eventFilePath):
                print(eventFileName + " does not exist")

        eventDict = {
            "Name": eventName,
            "Number": eventNumber,
            "Date": eventDate,
            "Source": eventSourceWikiLink,
            "Matches": []
        }

        print(eventName + " " + eventNumber)
        if not eventFilePath.endswith("060,Aug6,2005.csv"):
            with open(eventFilePath, 'r', encoding="utf-8") as eventFile:
                eventCsvReader = csv.DictReader(eventFile)

                for row in eventCsvReader:
                    MethodArray = row["Method"].split("(")
                    method = MethodArray[0].strip()
                    methodInfo = ""
                    decisionInfo = ""

                    if len(MethodArray) > 1:
                        methodInfo = MethodArray[1].replace(')', '').strip()
                    if len(MethodArray) > 2:
                        decisionInfo = MethodArray[2].replace(')', '').strip()

                    eventDict["Matches"].append({
                        "Weight Class": row["Weight Class"],
                        "Red Fighter": row["Red Fighter"],
                        "Outcome": row["Outcome"],
                        "Blue Fighter": row["Blue Fighter"],
                        "Time": row["Time"],
                        "Round": row["Round"],
                        "Method": method,
                        "Method Info": methodInfo,
                        "Decision Info": ""
                    })

                jsonDict["Events"].append(eventDict)

    with open(UFC_DIR+"/eventData.json", 'w') as eventDataJson:
        json.dump(jsonDict, eventDataJson)
