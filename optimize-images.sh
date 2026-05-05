#!/bin/bash

# optimize-images.sh
# Requires ImageMagick (mogrify)
# Usage: ./optimize-images.sh public/assets

TARGET_DIR=$1

if [ -z "$TARGET_DIR" ]; then
  echo "Usage: ./optimize-images.sh <directory>"
  exit 1
fi

echo "🚀 Starting image optimization in $TARGET_DIR..."

# Find all .webp files and optimize them
# 1. Resize to max 800px width (maintaining aspect ratio)
# 2. Set quality to 80
# 3. Strip metadata
find "$TARGET_DIR" -type f -name "*.webp" | while read -r img; do
  echo "Optimizing $img..."
  mogrify -resize 800x -quality 80 -strip "$img"
done

echo "✅ Optimization complete!"
