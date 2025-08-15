#!/bin/bash

# School Events Hub Installation Script
# This script will help you set up the School Events Hub application

set -e

echo "🏫 School Events Hub - Installation Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed or not in PATH."
    echo "   Please install PostgreSQL and ensure 'psql' is available."
    echo "   Visit: https://www.postgresql.org/download/"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ PostgreSQL detected"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please edit .env file with your configuration before starting the application"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..
echo "✅ Frontend dependencies installed"

# Create database setup script
echo "🗄️  Creating database setup script..."
cat > setup-db.sql << 'EOF'
-- School Events Hub Database Setup
-- Run this script in your PostgreSQL database

-- Create database (if it doesn't exist)
-- CREATE DATABASE school_events_hub;

-- Connect to the database
-- \c school_events_hub;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Note: The application will create tables automatically when it starts
-- Make sure your database user has the necessary permissions
EOF

echo "✅ Database setup script created (setup-db.sql)"
echo ""

# Create start script
echo "🚀 Creating start script..."
cat > start.sh << 'EOF'
#!/bin/bash

# School Events Hub Start Script

echo "🏫 Starting School Events Hub..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run install.sh first."
    exit 1
fi

# Start the application
echo "📱 Starting development servers..."
npm run dev

echo ""
echo "✅ School Events Hub is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the servers"
EOF

chmod +x start.sh
echo "✅ Start script created (start.sh)"
echo ""

# Create production build script
echo "🏗️  Creating production build script..."
cat > build.sh << 'EOF'
#!/bin/bash

# School Events Hub Production Build Script

echo "🏫 Building School Events Hub for production..."
echo ""

# Build frontend
echo "📱 Building frontend..."
cd client
npm run build
cd ..

echo ""
echo "✅ Production build completed!"
echo "   The built application is ready for deployment"
echo ""
echo "To start the production server:"
echo "   NODE_ENV=production npm start"
EOF

chmod +x build.sh
echo "✅ Production build script created (build.sh)"
echo ""

# Display next steps
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env file with your configuration"
echo "2. Set up your PostgreSQL database"
echo "3. Run: ./start.sh"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Complete setup guide"
echo "   - .env.example - Configuration options"
echo ""
echo "🔧 Development Commands:"
echo "   npm run dev          - Start development servers"
echo "   npm run server       - Start backend only"
echo "   npm run client       - Start frontend only"
echo "   npm test             - Run tests"
echo "   npm run lint         - Run linting"
echo ""
echo "🚀 Production Commands:"
echo "   ./build.sh           - Build for production"
echo "   NODE_ENV=production npm start - Start production server"
echo ""

# Ask if user wants to start the application
read -p "Would you like to start the application now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting School Events Hub..."
    npm run dev
fi