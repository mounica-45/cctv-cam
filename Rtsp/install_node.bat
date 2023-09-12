@echo off
echo Installing Node.js...

REM Check if Node.js is already installed
where node > nul 2>&1
if %errorlevel% equ 0 (
  echo Node.js is already installed.
) else (
  echo Installing Node.js...
  msiexec /i https://nodejs.org/dist/v14.17.3/node-v14.17.3-x64.msi /qn
  if %errorlevel% neq 0 (
    echo Failed to install Node.js. Please install it manually.
    goto end
  )
  echo Node.js installation complete.
)

echo Installing your_project dependencies...
TIMEOUT 5

REM Change directory to your project folder
cd "C:\Users\mouni\Desktop\rtsp_working_sol\RTSP"

REM Delete existing dependencies and package files
echo Deleting your_project dependencies...
if exist "node_modules" (
  echo Deleting node_modules directory...
  rmdir /s /q "node_modules"
)

if exist "package-lock.json" (
  echo Deleting package-lock.json...
  del "package-lock.json"
)

if exist "package.json" (
  echo Deleting package.json...
  del "package.json"
)

echo Deletion complete.

REM Install project dependencies
call npm install express axios ffmpeg-static

echo Starting your_project...
start /WAIT node app.js
echo Your_project has started.

@REM TIMEOUT 3
@REM echo Opening http://localhost:3000/ in Google Chrome...
@REM start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" http://localhost:3000/

TIMEOUT /T 3 /NOBREAK >nul
echo Opening http://localhost:3000/ in Google Chrome...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" http://localhost:3000/

@REM :end
