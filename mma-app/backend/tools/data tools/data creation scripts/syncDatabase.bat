@echo off
REM cd "../scraper scripts"
REM echo Scraping event list
REM python UfcEventListScraper.py
REM echo Scraping event data
REM python UfcEventScraper.py
REM cd "../conversion scripts"
REM echo Converting eventDataFilesToJson
REM python eventDataFilesToJson.py
REM cd "../data creation scripts"
echo Syncing database with event json file
node dataCreationTool.js