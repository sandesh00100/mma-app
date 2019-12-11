from bs4 import BeautifulSoup
from urllib.request import urlopen as uReq
from urllib import error
import csv
import time
import os

BASE_UFC_LINK = "https://www.ufc.com/athlete"

with open("../data/UFC/fighterList.txt",'r',encoding="utf-8") as fighterList:
    fighterImageDictArray = []
    for fighter in fighterList:
        formattedFighterLink = "/" + fighter.strip().replace(' ','-')
        requestNames = uReq(BASE_UFC_LINK + formattedFighterLink)
        pageHTML = requestNames.read()
        requestNames.close()
        soup = BeautifulSoup(pageHTML,"html.parser")
        imageDiv = soup.find("div",{"class":"c-bio__image"})
        imageLink = imageDiv.find("img")["src"]
        fighterImageDictArray.append({"Fighter":fighter,"ImageLink":imageLink})
        time.sleep(1)

    with open("../data/UFC/fighterImage.csv",'w',encoding='utf-8') as fighterImage:
        headers = ["Fighter","ImageLink"]
        csvWriter = csv.DictWriter(fighterImage, fieldnames=headers, delimiter=",")
        csvWriter.writeheader()
        for fighterImageDict in fighterImageDictArray:
            csvWriter.writerow(fighterImageDict)
    