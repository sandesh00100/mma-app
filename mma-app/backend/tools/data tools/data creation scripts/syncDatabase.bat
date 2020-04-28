@echo off
cd "../scraper scripts"
echo Scraping event list
python UfcEventListScraper.py
echo Scraping event data
python UfcEventScraper.py
cd "../conversion scripts"
echo Converting eventDataFilesToJson
python eventDataFilesToJson.py
cd "../data creation scripts"
echo Syncing database with event json file
node dataCreationTool.js
pause