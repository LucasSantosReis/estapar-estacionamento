#!/bin/bash

# Estapar Parking Management System - Run Script

echo "🚗 Estapar Parking Management System"
echo "====================================="

# Check if Java 21 is installed
if ! java -version 2>&1 | grep -q "21"; then
    echo "❌ Java 21 is required. Please install Java 21."
    exit 1
fi

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "⚠️  MySQL is not running. Please start MySQL service."
    echo "   You can use: sudo service mysql start"
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Start the garage simulator
echo "🔧 Starting garage simulator..."
docker run -d --network="host" cfontes0estapar/garage-sim:1.0.0

if [ $? -eq 0 ]; then
    echo "✅ Garage simulator started successfully!"
else
    echo "❌ Failed to start garage simulator. Please check Docker installation."
    exit 1
fi

# Wait a moment for the simulator to start
echo "⏳ Waiting for simulator to initialize..."
sleep 5

# Compile and run the application
echo "🔨 Compiling application..."
mvn clean compile

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed!"
    exit 1
fi

echo "✅ Compilation successful!"

# Run the application
echo "🚀 Starting application..."
echo "   Application will be available at: http://localhost:3003"
echo "   Press Ctrl+C to stop the application"
echo ""

mvn spring-boot:run
