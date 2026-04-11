@echo off
echo ========================================
echo   GIDION // BLACKSMITH SETUP
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo OK: Node.js found

echo.
echo [2/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo OK: Dependencies installed

echo.
echo [3/4] Checking Ollama...
curl -s http://localhost:11434 >nul 2>&1
if errorlevel 1 (
    echo NOTE: Ollama not running.
    echo Optional: Download from https://ollama.com
    echo For local AI, run: ollama pull qwen2.5:3b
) else (
    echo OK: Ollama is running
)

echo.
echo [4/4] Creating config...
if not exist "config\local.js" (
    copy config\default.js config\local.js
    echo Created config\local.js
    echo.
    echo IMPORTANT: Edit config\local.js to add your API keys!
    echo.
) else (
    echo Config already exists
)

echo.
echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo To start Gidion:
echo   npm start
echo.
echo To start Blacksmith Dashboard:
echo   Open: http://localhost:3210/blacksmith.html
echo.
pause
