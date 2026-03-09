@echo off
echo Syncing real legislative data from PRS Legislative Research...
echo.

curl -X POST http://localhost:3000/api/sync-bills

echo.
echo Done! Check your database for 15 real Indian bills.
pause
