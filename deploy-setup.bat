@echo off
echo Initializing Git repository...
cd /d f:\funding\policytrace-india

git init
git add .
git commit -m "PolicyTrace India - AI-powered legislative impact tracker"
git branch -M main
git remote add origin https://github.com/AadilRashid/policytrace-india.git

echo.
echo Repository initialized!
echo.
echo Next steps:
echo 1. Create repository on GitHub: https://github.com/new
echo    - Name: policytrace-india
echo    - Public repository
echo    - Don't initialize with README
echo.
echo 2. Then run: git push -u origin main
echo.
pause
