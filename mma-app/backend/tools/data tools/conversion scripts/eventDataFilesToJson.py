import csv
import json
import os

UFC_DIR = "../data/UFC"
EVENT_LIST_FILE = "UFC_Event_List.csv"

with open(UFC_DIR + "/" + EVENT_LIST_FILE, 'r', encoding="utf-8") as ufcEventListCsv:
    csvReader = csv.DictReader(ufcEventListCsv)
    jsonDict = {'events': []}

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
            "name": eventName,
            "number": eventNumber,
            "date": eventDate,
            "source": eventSourceWikiLink,
            "matches": []
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

                    eventDict["matches"].append({
                        "weightClass": row["Weight Class"],
                        "redFighter": row["Red Fighter"],
                        "outcome": row["Outcome"],
                        "blueFighter": row["Blue Fighter"],
                        "time": row["Time"],
                        "round": row["Round"],
                        "method": method,
                        "methodInfo": methodInfo,
                        "decisionInfo": decisionInfo
                    })

                jsonDict["events"].append(eventDict)

    with open(UFC_DIR+"/eventData.json", 'w') as eventDataJson:
        json.dump(jsonDict, eventDataJson)
