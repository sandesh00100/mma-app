from bs4 import BeautifulSoup
from urllib.request import urlopen as uReq
from urllib import error
import csv

BASE_WIKI_URL = "https://en.wikipedia.org"

TABLE_TAG = "table"
HEADER_TAG = "th"
ROW_TAG = "tr"
TABLE_DATA_TAG = "td"

PARSER_TYPE = "html.parser"
UFC_EVENT_LIST_CSV_PATH =  "../data/UFC/UFC_Event_List.csv"
TABLE_HEADER_SET = set(["Weight class","Method","Round","Time","Notes"])

def getFightTable(pageTables):
        for table in pageTables:
            rows = table.find_all(ROW_TAG)
            for row in rows:
                headers = row.find_all(HEADER_TAG)
                for header in headers:
                    headerText = header.get_text().strip()
                    if headerText in TABLE_HEADER_SET:
                        return table

try:
    with open(UFC_EVENT_LIST_CSV_PATH,'r') as ufcEventListCsv:
        csvReader = csv.DictReader(ufcEventListCsv)

        for row in csvReader:
            eventNumber = row["Number"]
            eventName = row["Name"]
            wikiLink = row["WikiLink"]
            request = uReq(BASE_WIKI_URL+wikiLink)
            pageHTML = request.read()
            soup = BeautifulSoup(pageHTML,PARSER_TYPE)

            pageTables = soup.find_all(TABLE_TAG)
            resultsTable = getFightTable(pageTables)
            
            rows = resultsTable.find_all(ROW_TAG)
            eventFolderPath = "../data/UFC/UFC Events"
            fileName = eventName + "_E" + eventNumber if eventNumber.strip().isdigit() else eventName
            eventFilePath = eventFolderPath + "/" + fileName + ".csv"

            with open(eventFilePath, 'w', newline = '', encoding="utf-8") as eventCsv:
                headers = ['Weight Class','Red Fighter','Outcome', 'Blue Fighter','Method', 'Round', 'Time']
                csvWriter = csv.DictWriter(eventCsv, fieldnames=headers, delimiter=",")
                csvWriter.writeheader()

                for row in rows:
                    tableData = row.find_all(TABLE_DATA_TAG)
                    if len(tableData) == 8:
                        rowDict = dict()
                        rowDict["Weight Class"] = tableData[0]
                        rowDict["Red Fighter"] = tableData[1]
                        rowDict["Outcome"] = tableData[2]
                        rowDict["Blue Fighter"] = tableData[3]
                        rowDict["Method"] = tableData[4]
                        rowDict["Round"] = tableData[5]
                        rowDict["Time"] = tableData[6]

                        csvWriter.writerow(rowDict)
            

            break

                        

except error.HTTPError:
    print("Can't Access UFC fighter WIKI")
