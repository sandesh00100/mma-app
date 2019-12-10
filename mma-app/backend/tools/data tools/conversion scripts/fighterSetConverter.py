import json
import csv

with open("../data/UFC/eventData.json", 'r', encoding="utf-8") as eventDataJson:
    eventDataDic = json.load(eventDataJson)
    fighterSet = set()
    for event in eventDataDic["events"]: 
        for match in event["matches"]:
            redFighterName = match["redFighter"].split("(")[0].strip()
            blueFighterName = match["blueFighter"].split("(")[0].strip()
            fighterSet.add(redFighterName)
            fighterSet.add(blueFighterName)

with open("../data/UFC/fighterList.txt",'w',encoding="utf-8") as fighterList:
    for fighter in fighterSet:
        fighterList.write(fighter+"\n")
