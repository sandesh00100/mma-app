import json

with open("../data/UFC/eventData.json",'r') as eventDataJson:
  eventData = json.load(eventDataJson)
  events = eventData["events"]
  weightClassSet = set()

  for event in events:
    matches = event["matches"]
    for match in matches:
      weightClassSet.add(match["weightClass"])

  for weightClass in weightClassSet:
    print(weightClass)
