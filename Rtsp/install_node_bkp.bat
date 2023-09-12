@echo off
echo Installing Node.js...
msiexec /i https://nodejs.org/dist/v14.17.3/node-v14.17.3-x64.msi /qn
echo Node.js installation complete.

@REM echo Installing your_project dependencies...
@REM TIMEOUT 5
@REM C:
@REM cd \Users\mouni\Desktop\rtsp_working_sol\rtsp-viewer
@REM call npm install

@REM echo Starting your_project...
@REM start /WAIT npm start
@REM echo Your_project has started.


echo Installing your_project dependencies...
TIMEOUT 5
C:
cd \Users\mouni\Desktop\rtsp_working_sol\RTSP
call npm install express axios ffmpeg-static
echo Starting your_project...
start /WAIT node app.js
echo Your_project has started.
TIMEOUT 3
start http://localhost:3000/



