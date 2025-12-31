#!/bin/bash
# EcoTrack Setup Script
# Run this script to get started quickly

echo "🌍 Welcome to EcoTrack!"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js $(node --version) found"
echo "✓ npm $(npm --version) found"
echo ""

# Check if MongoDB is available
echo "Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✓ MongoDB found locally"
elif command -v mongo &> /dev/null; then
    echo "✓ MongoDB client found"
else
    echo "⚠️  Local MongoDB not found"
    echo "   Options:"
    echo "   1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/"
    echo "   2. Use MongoDB Atlas cloud: https://www.mongodb.com/cloud/atlas"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "   This may take a few minutes..."
npm run install-all

if [ $? -ne 0 ]; then
    echo "❌ Installation failed!"
    exit 1
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Edit server/.env with your MongoDB connection"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - Quick start: QUICKSTART.md"
echo "   - Full guide: README.md"
echo "   - Project overview: PROJECT_SUMMARY.md"
echo ""
echo "🚀 Ready to start?"
echo "   Type: npm run dev"
echo ""
