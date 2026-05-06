#!/bin/bash

echo "🚀 Starting PARALLEL image optimization (untracked files only)..."

# Find untracked .webp files
UNTRACKED_FILES=$(git ls-files --others --exclude-standard | grep "public/assets/.*\.webp")

if [ -z "$UNTRACKED_FILES" ]; then
  echo "✅ No new untracked webp files found."
else
  COUNT=$(echo "$UNTRACKED_FILES" | wc -l)
  echo "📦 Found $COUNT new files to optimize. Using parallel processing..."
  
  # Use xargs with -P to run multiple processes at once
  echo "$UNTRACKED_FILES" | xargs -P 8 -I {} sh -c 'echo "Optimizing {}..."; mogrify -resize 800x -quality 80 -strip "{}"'
  
  echo "✅ Parallel optimization complete!"
fi
