#!/bin/bash

# RAG PDF Chrome Extension Setup Script

echo "🚀 Setting up RAG PDF Chrome Extension..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo "✅ npm $(npm --version) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the extension
echo ""
echo "🔨 Building extension..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build extension"
    exit 1
fi

echo "✅ Extension built successfully"

# Check if dist directory was created
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top-right)"
echo "3. Click 'Load unpacked' and select the 'dist' folder"
echo "4. Make sure the backend server is running: python main.py"
echo "5. Click the extension icon in Chrome toolbar"
echo ""
echo "📖 For detailed instructions, see README.md"