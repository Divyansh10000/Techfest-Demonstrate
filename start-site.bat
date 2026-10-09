@echo off
REM Techfest 2026 - local preview server. Double-click to run, then open http://localhost:8080
cd /d "%~dp0"
echo Serving Techfest 2026 at http://localhost:8080
echo Press Ctrl+C to stop.
python -m http.server 8080
pause
