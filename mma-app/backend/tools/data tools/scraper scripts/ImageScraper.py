from bs4 import BeautifulSoup
from urllib.request import urlopen as uReq
from urllib import error
import csv
import time
import os
import sys
'''

IMAGE SCRAPER
Uses fighterList.txt and tries to search for every fighter's bio image.
Scrapes through "https://www.ufc.com/athlete"

'''

BASE_UFC_LINK = "https://www.ufc.com/athlete"

try:
    with open("../data/UFC/fighterList.txt",'r',encoding="utf-8") as fighterList:
        fighterImageDictArray = []
        for fighter in fighterList:
            try:
                print("Starting to fetch " + fighter)
                formattedFighterLink = "/" + fighter.strip().replace(' ','-')
                requestNames = uReq(BASE_UFC_LINK + formattedFighterLink)
                pageHTML = requestNames.read()
                requestNames.close()
                soup = BeautifulSoup(pageHTML,"html.parser")
                imageDiv = soup.find("div",{"class":"c-bio__image"})
                imageLink = "Not Found"
                if imageDiv != None:
                    imageLink = imageDiv.find("img")["src"]
                fighterImageDictArray.append({"Fighter":fighter.strip(),"ImageLink":imageLink.strip()})
                time.sleep(.1)
            except:
                sys.exit(1)
                print("couldnt fetch info for" + fighter)
            

        with open("../data/UFC/fighterImage.csv",'w',encoding='utf-8') as fighterImage:
            headers = ["Fighter","ImageLink"]
            csvWriter = csv.DictWriter(fighterImage, fieldnames=headers, delimiter=",")
            csvWriter.writeheader()
            for fighterImageDict in fighterImageDictArray:
                csvWriter.writerow(fighterImageDict)
    sys.exit(0)
except:
    sys.exit(1)
    