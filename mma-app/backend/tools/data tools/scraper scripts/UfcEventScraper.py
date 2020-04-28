from bs4 import BeautifulSoup
from urllib.request import urlopen as uReq
from urllib import error
import csv
import time
import os
import sys
'''

UFC EVENT SCRAPER
Uses UFC_Event_List.csv to go through all of it's wiki links for each event and for each event it creates a csv.

'''

BASE_WIKI_URL = "https://en.wikipedia.org"

TABLE_TAG = "table"
HEADER_TAG = "th"
ROW_TAG = "tr"
TABLE_DATA_TAG = "td"

PARSER_TYPE = "html.parser"
UFC_EVENT_LIST_CSV_PATH =  "../data/UFC/UFC_Event_List.csv"
FIGHT_TABLE_HEADER_SET = set(["Weight class","Method","Round","Time","Notes"])
INFO_TABLE_HEADER_SET = set(["Promotion","Date","Venue","Attendance","Total gate"])
DATE_HEADER = "Date"

def isFightTable(table):
    rows = table.find_all(ROW_TAG)
    for row in rows:
        headers = row.find_all(HEADER_TAG)
        for header in headers:
            headerText = header.get_text().strip()
            if headerText in FIGHT_TABLE_HEADER_SET:
                if len(headers) != 8:
                    return False
                else:
                    return True
    return False

def isInfoTable(table):
    rows = table.find_all(ROW_TAG)
    for row in rows:
        headers = row.find_all(HEADER_TAG)
        if len(headers) == 1:
            headerText = headers[0].get_text().strip()
            if headerText in INFO_TABLE_HEADER_SET:
                return True
    return False

def getInfoTableDate(table):
    rows = table.find_all(ROW_TAG)
    for row in rows:
        header = row.find(HEADER_TAG)
        if header != None:
            headerText = header.get_text()
            if headerText == DATE_HEADER:
                date = row.find(TABLE_DATA_TAG).get_text().strip()
                dateArray = date.split(",")

                formattedDate = dateArray[0][:3] + dateArray[0][-2:].strip() + "," + dateArray[1].strip()[0:4]
                return formattedDate

def writeTableCsv(table, eventFilePath):
    print("Writing " + eventFilePath)
    with open(eventFilePath, 'w', newline = '', encoding="utf-8") as eventCsv:
        headers = ['Weight Class','Red Fighter','Outcome', 'Blue Fighter','Method', 'Round', 'Time']
        csvWriter = csv.DictWriter(eventCsv, fieldnames=headers, delimiter=",")
        csvWriter.writeheader()

        rows = table.find_all(ROW_TAG)

        for row in rows:
            tableData = row.find_all(TABLE_DATA_TAG)
            if len(tableData) == 8:
                rowDict = dict()
                rowDict["Weight Class"] = tableData[0].get_text().strip()
                rowDict["Red Fighter"] = tableData[1].get_text().strip()
                rowDict["Outcome"] = tableData[2].get_text().strip()
                rowDict["Blue Fighter"] = tableData[3].get_text().strip()
                rowDict["Method"] = tableData[4].get_text().strip()
                rowDict["Round"] = tableData[5].get_text().strip()
                rowDict["Time"] = tableData[6].get_text().strip()

                csvWriter.writerow(rowDict)

matchFileList = os.listdir("X:/git/mma-app/mma-app/backend/tools/data tools/data/UFC/UFC Events")
dateSet = set()

for matchFile in matchFileList:
    matchFileArr = matchFile.split(",")
    matchFileArrLen = len(matchFileArr)
    year = matchFileArr[matchFileArrLen-1].split(".")[0]
    monthDay = matchFileArr[matchFileArrLen-2]
    dateSet.add(monthDay + "," + year)

try:
    with open(UFC_EVENT_LIST_CSV_PATH,'r') as ufcEventListCsv:
        csvReader = csv.DictReader(ufcEventListCsv)
        for row in csvReader:
            eventDate = row["Date"].replace(' ','')
            wikiLink = row["WikiLink"]
            if eventDate not in dateSet:
                if len(wikiLink) > 0:
                    print("Requesting " + wikiLink)
                    
                    request = uReq(BASE_WIKI_URL+wikiLink)
                    pageHTML = request.read()
                    soup = BeautifulSoup(pageHTML,PARSER_TYPE)

                    pageTables = soup.find_all(TABLE_TAG)

                    validResultsTables = []
                    validInfoTables = []
                    infoTableDates = []

                    for table in pageTables:
                        if isFightTable(table):
                            validResultsTables.append(table)
                        elif isInfoTable(table):
                            validInfoTables.append(table)
                            date = getInfoTableDate(table)
                            infoTableDates.append(date)

                    for i, validResultsTable in enumerate(validResultsTables):
                        eventFolderPath = "../data/UFC/UFC Events"
                        fileName = infoTableDates[i]
                        eventNumber = row["Number"].strip()
                        if len(eventNumber) > 0:
                            fileName = eventNumber + "," + fileName
                            
                        eventFilePath = eventFolderPath + "/" + fileName + ".csv"
                        
                        writeTableCsv(validResultsTable,eventFilePath)
                
                time.sleep(2)
    sys.exit(0)

except:
    sys.exit(1)
    print("Can't Access UFC fighter WIKI")
