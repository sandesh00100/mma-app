from bs4 import BeautifulSoup
from urllib.request import urlopen as uReq
from urllib import error
import csv

LIST_OF_UFC_EVENTS_URL = "https://en.wikipedia.org/wiki/List_of_UFC_events"
BASE_WIKI_URL = "https://en.wikipedia.org/wiki"
STATIC_HTML_PATH = "X:/Downloads/List of UFC events - Wikipedia.html"

TABLE_TAG = 'table'
PARSER_TYPE = 'html.parser'
PAST_EVENTS_TABLE_NAME = 'Past_events'

try:
    #requestNames = uReq(LIST_OF_UFC_EVENTS_URL)
    #pageHTML = requestNames.read()
    #requestNames.close()
    with open(STATIC_HTML_PATH, 'r', encoding="utf-8") as pageHTML:
        soup = BeautifulSoup(pageHTML.read(),PARSER_TYPE)
        tables = soup.find_all(TABLE_TAG)

        pastEventsTable = None
        
        # Find pastEventsTable   
        for table in tables:
            if table.has_attr('id'):
                if table['id'] == PAST_EVENTS_TABLE_NAME:
                    print(table['id'])
                    pastEventsTable = table

        tableRows = pastEventsTable.find_all('tr')

        with open("../data/UFC/UFC_Event_List.csv", 'w', newline ='',encoding='utf-8') as eventListFile:
            headers = ['Number','WikiLink','Name','Date']
            csvWriter = csv.DictWriter(eventListFile, fieldnames=headers, delimiter=',')
            csvWriter.writeheader()

            for i, row in enumerate(tableRows):
                # Skip Header
                if i > 0:
                    tableDatas = row.find_all('td')
                    # Loop through tds
                    rowDict = dict()
                    rowDict['Number'] = tableDatas[0].get_text().strip()
                    if tableDatas[1].a:
                        rowDict['WikiLink'] = tableDatas[1].a['href'].strip()
                    rowDict['Name'] = tableDatas[1].get_text().strip()
                    rowDict['Date'] = tableDatas[2].get_text().strip()
                    csvWriter.writerow(rowDict)

except error.HTTPError:
    print("Can't Access UFC fighter WIKI")



