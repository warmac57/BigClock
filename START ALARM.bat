@echo off
echo Starting BigClock Server...
echo.
echo The browser should open automatically at: http://localhost:8000
echo If it doesn't, please click: http://localhost:8000
echo.
echo Press Ctrl+C in this window to stop the server when finished.
echo.

:: Open the default browser to the local server address
start http://localhost:8000

:: Start the Python HTTP server
python -m http.server 8000
