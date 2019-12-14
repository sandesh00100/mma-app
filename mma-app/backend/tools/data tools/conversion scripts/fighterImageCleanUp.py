import csv

'''

FIGHTER IMAGE CLEAN UP CONVERTER
Checks the fighterList.txt and checks if fighterImage.csv contains all of the fighters.
When scraping through images there were times where some fighters were skipped.

'''
with open("../data/UFC/fighterList.txt", "r", encoding="utf-8") as fighterList:
    fighterSet = set()
    for fighter in fighterList:
        fighterSet.add(fighter.strip())

    fighterImageSet = set()
    with open("../data/UFC/fighterImage.csv", "r", encoding="utf-8") as fighterImageList:
        csvReader = csv.DictReader(fighterImageList)

        for fighterImage in csvReader:
            fighterImageSet.add(fighterImage["Fighter"].strip())

    unAddedFighters = fighterSet.difference(fighterImageSet)
    with open("../data/UFC/fighterImage.csv", 'a', encoding="utf-8", newline='') as fighterImageList:
        headers = ["Fighter", "ImageLink"]
        csvWriter = csv.DictWriter(
            fighterImageList, fieldnames=headers, delimiter=",")

        for fighter in unAddedFighters:
            csvWriter.writerow(
                {"Fighter": fighter.strip(), "ImageLink": "NONE"})
