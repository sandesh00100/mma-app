import csv
import json
import os

'''

EVENT DATA FILES TO JSON CONVERTER
Takes in all of the match .csv files in data/UFC/UFC Events/* and generates a JSON File

'''
def isNewFile(number, date, eventJson):
    for event in eventJson["events"]:
        if event["number"].strip() == number and event["date"].strip():
            return False
    return True

UFC_DIR = "../data/UFC"
EVENT_LIST_FILE = "UFC_Event_List.csv"

# Load event json file
eventJson = None
with open(UFC_DIR+"/eventData.json", 'r', encoding="utf-8") as eventJsonFile:
    eventJson = json.load(eventJsonFile)

with open(UFC_DIR + "/" + EVENT_LIST_FILE, 'r', encoding="utf-8") as ufcEventListCsv:
    csvReader = csv.DictReader(ufcEventListCsv)
    newEvents = []

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
                break
        
        if isNewFile(eventNumber, eventDate, eventJson):
            print("adding " + eventNumber + " " + eventDate)
            eventDict = {
                "inDatabase":False,
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

                    newEvents.append(eventDict)

    with open(UFC_DIR+"/eventData.json", 'w') as eventJsonFile:
        eventJson["events"] = newEvents + eventJson["events"]
        json.dump(eventJson, eventJsonFile, indent=2)
