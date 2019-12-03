from bs4 import BeautifulSoup
from urllib.request import urlopen as uReq
from urllib import error
import csv
import time

BASE_WIKI_URL = "https://en.wikipedia.org"

TABLE_TAG = "table"
HEADER_TAG = "th"
ROW_TAG = "tr"
TABLE_DATA_TAG = "td"

PARSER_TYPE = "html.parser"
UFC_EVENT_LIST_CSV_PATH =  "../data/UFC/UFC_Event_List_Alt.csv"
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
        for header in headers:
            headerText = header.get_text().strip()
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
                date = row.find(TABLE_DATA_TAG)
                return date.get_text().strip()

def writeTableCsv(table, eventFilePath):
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

try:
    with open(UFC_EVENT_LIST_CSV_PATH,'r') as ufcEventListCsv:
        csvReader = csv.DictReader(ufcEventListCsv)

        for row in csvReader:
            eventDate = row["Date"]
            wikiLink = row["WikiLink"]

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

                eventFolderPath = "../data/UFC/UFC Events"
                
                if len(validResultsTables) > 1:
                    for i, validResultsTable in enumerate(validResultsTables):
                        infoDate = infoTableDates[i]
                        fileName = infoDate.replace(' ','')
                        eventFilePath = eventFolderPath + "/" + fileName + ".csv"
                        writeTableCsv(validResultsTable,eventFilePath)
                else:
                    resultsTable = validResultsTables[0]
                    fileName = eventDate.replace(' ','')
                    eventFilePath = eventFolderPath + "/" + fileName + ".csv"
                    writeTableCsv(resultsTable, eventFilePath)
            
            time.sleep(2)

except error.HTTPError:
    print("Can't Access UFC fighter WIKI")
