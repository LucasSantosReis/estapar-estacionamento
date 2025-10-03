@echo off
REM Estapar Parking Management System - Run Script for Windows

echo 🚗 Estapar Parking Management System
echo =====================================

REM Check if Java 21 is installed
java -version 2>&1 | findstr "21" >nul
if errorlevel 1 (
    echo ❌ Java 21 is required. Please install Java 21.
    pause
    exit /b 1
)

REM Check if Maven is installed
where mvn >nul 2>&1
if errorlevel 1 (
    echo ❌ Maven is not installed. Please install Maven.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Start the garage simulator
echo 🔧 Starting garage simulator...
docker run -d --network="host" cfontes0estapar/garage-sim:1.0.0

if errorlevel 1 (
    echo ❌ Failed to start garage simulator. Please check Docker installation.
    pause
    exit /b 1
) else (
    echo ✅ Garage simulator started successfully!
)

REM Wait a moment for the simulator to start
echo ⏳ Waiting for simulator to initialize...
timeout /t 5 /nobreak >nul

REM Compile and run the application
echo 🔨 Compiling application...
call mvn clean compile

if errorlevel 1 (
    echo ❌ Compilation failed!
    pause
    exit /b 1
)

echo ✅ Compilation successful!

REM Run the application
echo 🚀 Starting application...
echo    Application will be available at: http://localhost:3003
echo    Press Ctrl+C to stop the application
echo.

call mvn spring-boot:run
