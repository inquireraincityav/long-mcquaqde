#!/usr/bin/env python3
"""
Download real product images from Long & McQuade for all 74 inventory items.
Run locally: python3 download-real-images.py
"""
import json, os, re, hashlib, time, sys

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Install dependencies first: pip install requests beautifulsoup4")
    sys.exit(1)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def slug(name):
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    s = name.lower().replace(' ', '-').replace('/', '-').replace('"', '').replace("'", '')
    s = ''.join(c for c in s if c.isalnum() or c == '-')
    return s[:40] + '-' + h

def download_image_from_lm(source_link, product_name):
    """Scrape the Long & McQuade product page for the main product image."""
    try:
        resp = requests.get(source_link, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')

        img_url = None

        # Strategy 1: Open Graph image meta tag
        og = soup.find('meta', property='og:image')
        if og and og.get('content'):
            img_url = og['content']

        # Strategy 2: Main product image by common selectors
        if not img_url:
            for selector in [
                'img.product-image', '#mainImage', '.product-image img',
                '.main-image img', 'img[itemprop="image"]',
                '.product-gallery img', '.product-photo img'
            ]:
                el = soup.select_one(selector)
                if el and el.get('src'):
                    img_url = el['src']
                    break

        # Strategy 3: Largest image on page
        if not img_url:
            imgs = soup.find_all('img')
            best = None
            for img in imgs:
                src = img.get('src', '')
                if not src or 'logo' in src.lower() or 'icon' in src.lower() or 'banner' in src.lower():
                    continue
                w = img.get('width', '')
                h = img.get('height', '')
                try:
                    size = int(w) * int(h) if w and h else 0
                except ValueError:
                    size = 0
                if size > 0 and (best is None or size > best[1]):
                    best = (src, size)
            if best:
                img_url = best[0]

        if not img_url:
            return None

        # Make URL absolute
        if img_url.startswith('//'):
            img_url = 'https:' + img_url
        elif img_url.startswith('/'):
            from urllib.parse import urlparse
            parsed = urlparse(source_link)
            img_url = f"{parsed.scheme}://{parsed.netloc}{img_url}"

        # Download the image
        img_resp = requests.get(img_url, headers=HEADERS, timeout=15)
        img_resp.raise_for_status()

        content_type = img_resp.headers.get('content-type', '')
        if 'png' in content_type:
            ext = '.png'
        elif 'webp' in content_type:
            ext = '.webp'
        elif 'gif' in content_type:
            ext = '.gif'
        else:
            ext = '.jpg'

        return (img_resp.content, ext)

    except Exception as e:
        print(f"  Error: {e}")
        return None

def main():
    os.makedirs('public/products', exist_ok=True)

    with open('data/inventory.json') as f:
        inventory = json.load(f)

    success = 0
    failed = []

    for i, item in enumerate(inventory):
        name = item['product']
        link = item.get('sourceLink')
        filename_base = slug(name)

        print(f"[{i+1}/{len(inventory)}] {name[:60]}...", end=' ', flush=True)

        if not link:
            print("SKIP (no sourceLink)")
            failed.append(name)
            continue

        result = download_image_from_lm(link, name)
        if result:
            data, ext = result
            filename = filename_base + ext
            filepath = os.path.join('public', 'products', filename)
            with open(filepath, 'wb') as f:
                f.write(data)
            item['imageSource'] = f'/products/{filename}'
            print(f"OK ({len(data)//1024}KB)")
            success += 1
        else:
            print("FAILED")
            failed.append(name)

        # Be polite to L&M servers
        time.sleep(0.5)

    # Save updated inventory
    with open('data/inventory.json', 'w') as f:
        json.dump(inventory, f, indent=2)

    print(f"\nDone! {success}/{len(inventory)} images downloaded.")
    if failed:
        print(f"\nFailed ({len(failed)}):")
        for name in failed:
            print(f"  - {name}")

    print(f"\nNext steps:")
    print(f"  git add public/products/ data/inventory.json")
    print(f"  git commit -m 'Add real product images from Long & McQuade'")
    print(f"  git push origin main")
    print(f"\nVercel will auto-deploy once you push!")

if __name__ == '__main__':
    main()
