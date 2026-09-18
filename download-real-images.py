#!/usr/bin/env python3
"""
Download real product images for all 74 inventory items.
Uses Playwright (headless Chromium) to render L&M pages and capture product images.
Falls back to Google Image search if L&M doesn't have a good image.

Setup:
  pip install requests beautifulsoup4 playwright
  playwright install chromium

Run:
  python3 download-real-images.py
"""
import json, os, re, hashlib, time, sys, asyncio

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Install dependencies: pip install requests beautifulsoup4 playwright")
    print("Then run: playwright install chromium")
    sys.exit(1)

try:
    from playwright.async_api import async_playwright
    HAS_PLAYWRIGHT = True
except ImportError:
    HAS_PLAYWRIGHT = False
    print("WARNING: playwright not installed. Using requests only (less reliable).")
    print("For best results: pip install playwright && playwright install chromium")

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

MIN_GOOD_SIZE = 3000  # bytes - anything smaller is a placeholder/thumbnail

def slug(name):
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    s = name.lower().replace(' ', '-').replace('/', '-').replace('"', '').replace("'", '')
    s = ''.join(c for c in s if c.isalnum() or c == '-')
    return s[:40] + '-' + h


async def download_with_playwright(source_link, product_name, browser):
    """Use headless browser to find and download the real product image."""
    page = await browser.new_page()
    try:
        await page.goto(source_link, wait_until='networkidle', timeout=20000)
        await page.wait_for_timeout(2000)  # extra wait for lazy-loaded images

        # L&M-specific: look for the main product image
        # Try multiple selectors that L&M product pages commonly use
        selectors = [
            '.product-detail img',
            '.product-image img',
            '#product-image img',
            '.product-gallery img',
            '[data-zoom-image]',
            '.main-image img',
            'img[itemprop="image"]',
            '.gallery-image img',
            '.slick-current img',
            '.product-media img',
            '#mainImage',
        ]

        img_url = None
        for sel in selectors:
            el = await page.query_selector(sel)
            if el:
                # Check data-zoom-image first (highest res), then data-src, then src
                for attr in ['data-zoom-image', 'data-large', 'data-src', 'src']:
                    val = await el.get_attribute(attr)
                    if val and not _is_generic(val):
                        img_url = val
                        break
                if img_url:
                    break

        # Fallback: find largest visible image that's not a logo/banner
        if not img_url:
            imgs = await page.query_selector_all('img')
            best = None
            best_area = 0
            for img in imgs:
                try:
                    bbox = await img.bounding_box()
                    if not bbox or bbox['width'] < 150 or bbox['height'] < 150:
                        continue
                    src = await img.get_attribute('src') or ''
                    if _is_generic(src):
                        continue
                    area = bbox['width'] * bbox['height']
                    if area > best_area:
                        best = src
                        best_area = area
                except:
                    continue
            img_url = best

        if img_url:
            # Make absolute
            if img_url.startswith('//'):
                img_url = 'https:' + img_url
            elif img_url.startswith('/'):
                from urllib.parse import urlparse
                parsed = urlparse(source_link)
                img_url = f"{parsed.scheme}://{parsed.netloc}{img_url}"

            # Download
            resp = requests.get(img_url, headers=HEADERS, timeout=15)
            if resp.status_code == 200 and len(resp.content) > MIN_GOOD_SIZE:
                ext = _get_ext(resp.headers.get('content-type', ''), img_url)
                return (resp.content, ext)

        return None
    except Exception as e:
        print(f"\n    Playwright error: {e}")
        return None
    finally:
        await page.close()


def download_from_google_images(product_name):
    """Search Google Images for the product and download the first result."""
    try:
        query = f"{product_name} product photo"
        url = f"https://www.google.com/search?q={requests.utils.quote(query)}&tbm=isch&safe=active"
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return None

        # Extract image URLs from Google Images results
        # Google embeds base64 thumbnails and links to originals
        soup = BeautifulSoup(resp.text, 'html.parser')

        # Look for image data in script tags
        for script in soup.find_all('script'):
            text = script.string or ''
            # Find full-size image URLs
            urls = re.findall(r'https?://[^"\'\\]+\.(?:jpg|jpeg|png|webp)', text)
            for img_url in urls:
                if _is_generic(img_url):
                    continue
                if 'google' in img_url or 'gstatic' in img_url:
                    continue
                try:
                    img_resp = requests.get(img_url, headers=HEADERS, timeout=10)
                    if img_resp.status_code == 200 and len(img_resp.content) > MIN_GOOD_SIZE:
                        ext = _get_ext(img_resp.headers.get('content-type', ''), img_url)
                        return (img_resp.content, ext)
                except:
                    continue
        return None
    except Exception as e:
        print(f"\n    Google search error: {e}")
        return None


def download_with_requests(source_link, product_name):
    """Simple requests-based scraping of L&M product page."""
    try:
        resp = requests.get(source_link, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')

        img_url = None

        # Look for product-specific image selectors (NOT og:image which is generic)
        for selector in [
            'img.product-image', '#mainImage', '.product-image img',
            '.main-image img', 'img[itemprop="image"]',
            '.product-gallery img', '.product-photo img',
            '[data-zoom-image]',
        ]:
            el = soup.select_one(selector)
            if el:
                for attr in ['data-zoom-image', 'data-large', 'data-src', 'src']:
                    val = el.get(attr)
                    if val and not _is_generic(val):
                        img_url = val
                        break
                if img_url:
                    break

        # Look for img tags with product-related URLs (not logos/banners)
        if not img_url:
            for img in soup.find_all('img'):
                src = img.get('data-src') or img.get('src') or ''
                if not src or _is_generic(src):
                    continue
                # Look for images in product/upload/media paths
                if any(kw in src.lower() for kw in ['product', 'upload', 'media', 'image', 'item']):
                    img_url = src
                    break

        if not img_url:
            return None

        # Make absolute
        if img_url.startswith('//'):
            img_url = 'https:' + img_url
        elif img_url.startswith('/'):
            from urllib.parse import urlparse
            parsed = urlparse(source_link)
            img_url = f"{parsed.scheme}://{parsed.netloc}{img_url}"

        img_resp = requests.get(img_url, headers=HEADERS, timeout=15)
        if img_resp.status_code == 200 and len(img_resp.content) > MIN_GOOD_SIZE:
            ext = _get_ext(img_resp.headers.get('content-type', ''), img_url)
            return (img_resp.content, ext)

        return None
    except Exception as e:
        print(f"\n    Requests error: {e}")
        return None


def _is_generic(url):
    """Check if URL is a generic/logo/banner image."""
    lower = url.lower()
    return any(kw in lower for kw in [
        'logo', 'icon', 'banner', 'sprite', 'pixel', 'spacer',
        'placeholder', 'default', 'blank', 'loading', 'spinner',
        'social', 'facebook', 'twitter', 'instagram', 'youtube',
        'favicon', 'badge', 'arrow', 'close', 'search',
    ])


def _get_ext(content_type, url):
    """Determine file extension from content type or URL."""
    ct = content_type.lower()
    if 'webp' in ct:
        return '.webp'
    elif 'png' in ct:
        return '.png'
    elif 'gif' in ct:
        return '.gif'
    # Check URL extension
    for ext in ['.webp', '.png', '.gif']:
        if ext in url.lower():
            return ext
    return '.jpg'


async def main_async():
    os.makedirs('public/products', exist_ok=True)

    with open('data/inventory.json') as f:
        inventory = json.load(f)

    browser = None
    if HAS_PLAYWRIGHT:
        pw = await async_playwright().start()
        browser = await pw.chromium.launch(headless=True)

    success = 0
    failed = []

    for i, item in enumerate(inventory):
        name = item['product']
        link = item.get('sourceLink')
        filename_base = slug(name)

        # Skip if we already have a good image
        existing = item.get('imageSource', '')
        if existing:
            existing_path = 'public' + existing
            if os.path.exists(existing_path) and os.path.getsize(existing_path) > MIN_GOOD_SIZE:
                # Verify it's not the generic L&M banner (13536 bytes)
                size = os.path.getsize(existing_path)
                if size != 13536:
                    print(f"[{i+1}/{len(inventory)}] {name[:55]}... SKIP (already good {size//1024}KB)")
                    success += 1
                    continue

        print(f"[{i+1}/{len(inventory)}] {name[:55]}...", end=' ', flush=True)

        result = None

        # Strategy 1: Playwright (if available) - best for JS-rendered pages
        if browser and link:
            result = await download_with_playwright(link, name, browser)
            if result:
                print("OK (Playwright)", end=' ')

        # Strategy 2: Simple requests scraping
        if not result and link:
            result = download_with_requests(link, name)
            if result:
                print("OK (requests)", end=' ')

        # Strategy 3: Google Images search
        if not result:
            result = download_from_google_images(name)
            if result:
                print("OK (Google)", end=' ')

        if result:
            data, ext = result
            filename = filename_base + ext
            filepath = os.path.join('public', 'products', filename)
            with open(filepath, 'wb') as f:
                f.write(data)
            item['imageSource'] = f'/products/{filename}'
            print(f"({len(data)//1024}KB)")
            success += 1
        else:
            print("FAILED")
            failed.append(name)

        time.sleep(0.5)

    if browser:
        await browser.close()

    # Save updated inventory
    with open('data/inventory.json', 'w') as f:
        json.dump(inventory, f, indent=2)

    print(f"\n{'='*60}")
    print(f"Done! {success}/{len(inventory)} images downloaded.")
    if failed:
        print(f"\nFailed ({len(failed)}):")
        for name in failed:
            print(f"  - {name}")
        print(f"\nFailed items will use illustrated fallback images.")

    print(f"\nNext steps:")
    print(f"  git add public/products/ data/inventory.json")
    print(f"  git commit -m 'Update product images'")
    print(f"  git push origin main")


def main():
    asyncio.run(main_async())


if __name__ == '__main__':
    main()
