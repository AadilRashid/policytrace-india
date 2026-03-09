@echo off
set PATH=%PATH%;C:\Program Files\nodejs
cd /d f:\funding\policytrace-india
npm install dotenv
node test-azure.js
pause
