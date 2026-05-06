#!/bin/bash

echo "🚀 Starting smart image optimization (untracked files only)..."

# Find untracked .webp files in public/assets
# git ls-files --others --exclude-standard | grep "public/assets/.*\.webp"
UNTRACKED_FILES=$(git ls-files --others --exclude-standard | grep "public/assets/.*\.webp")

if [ -z "$UNTRACKED_FILES" ]; then
  echo "✅ No new untracked webp files found."
else
  COUNT=$(echo "$UNTRACKED_FILES" | wc -l)
  echo "📦 Found $COUNT new files to optimize."
  
  echo "$UNTRACKED_FILES" | while read -r img; do
    echo "Optimizing $img..."
    mogrify -resize 800x -quality 80 -strip "$img"
  done
  echo "✅ Optimization complete!"
fi
