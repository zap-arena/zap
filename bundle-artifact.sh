#!/bin/bash
set -e

echo "📦 Bundling React app to single HTML artifact..."

# Check if we're in a project directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: No package.json found. Run this script from your project root."
  exit 1
fi

# Check if index.html exists
if [ ! -f "index.html" ]; then
  echo "❌ Error: No index.html found in project root."
  echo "   This script requires an index.html entry point."
  exit 1
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist bundle.html render

# Build with Vite (vite-plugin-singlefile will inline everything)
echo "🔨 Building with Vite (all assets will be inlined)..."
SINGLE_FILE=1 pnpm build

# Copy the single-file build output
echo "� Copying single-file bundle..."
# make render directory if don't exist
mkdir -p render

cp dist/index.html render/index.html

# Get file size
FILE_SIZE=$(du -h render/index.html | cut -f1)

echo ""
echo "✅ Bundle complete!"
echo "📄 Output: render/index.html ($FILE_SIZE)"
echo ""