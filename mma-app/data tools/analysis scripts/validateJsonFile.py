import json

with open("../data/UFC/eventData.json",'r') as eventDataJson:
    eventData = json.load(eventDataJson)
    events = eventData["Events"]

    print("Length of events = " + str(len(events)))

    for event in events:
        print(event["Name"] + " " + event["Number"] + " Match Length = " + str(len(event["Matches"])))