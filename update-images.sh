#!/bin/bash
# One-step script to download real product images and push to the repo.
# Run from the project root: ./update-images.sh

set -e

echo "=== Step 1: Setting up Python environment ==="
if [ -d "venv" ]; then
    source venv/bin/activate
else
    python3 -m venv venv
    source venv/bin/activate
    pip install requests beautifulsoup4
fi

# Install playwright if not already installed (optional but recommended)
pip install playwright 2>/dev/null && python3 -m playwright install chromium 2>/dev/null || echo "Playwright not available - using requests fallback (still works fine)"

echo ""
echo "=== Step 2: Downloading real product images ==="
python3 download-real-images.py

echo ""
echo "=== Step 3: Committing and pushing ==="
git add public/products/ data/inventory.json
git commit -m "Add real product images from Long & McQuade"
git push origin main

echo ""
echo "=== Done! ==="
echo "Images are now live. Vercel will auto-deploy in ~60 seconds."
echo "Check: https://sahilocal-yfny.vercel.app"
