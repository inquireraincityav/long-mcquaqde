#!/usr/bin/env python3
"""
Fix the 18 products that got the L&M generic banner instead of real images.
Uses Playwright screenshots as primary strategy since scraping failed for these.

Setup:
  pip install requests beautifulsoup4 playwright
  playwright install chromium

Run:
  python3 fix-missing-images.py
"""
import json, os, re, hashlib, time, sys, asyncio

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("pip install requests beautifulsoup4 playwright")
    sys.exit(1)

try:
    from playwright.async_api import async_playwright
    HAS_PLAYWRIGHT = True
except ImportError:
    HAS_PLAYWRIGHT = False
    print("ERROR: This script requires Playwright for screenshots.")
    print("Run: pip install playwright && playwright install chromium")
    sys.exit(1)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Direct search URLs for the 18 failed products - search B&H Photo, Sweetwater, Amazon
SEARCH_SITES = [
    "site:bhphotovideo.com",
    "site:sweetwater.com",
    "site:amazon.ca",
    "site:long-mcquade.com",
]

def slug(name):
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    s = name.lower().replace(' ', '-').replace('/', '-').replace('"', '').replace("'", '')
    s = ''.join(c for c in s if c.isalnum() or c == '-')
    return s[:40] + '-' + h


def _is_generic(url):
    lower = url.lower()
    return any(kw in lower for kw in [
        'logo', 'icon', 'banner', 'sprite', 'pixel', 'spacer',
        'placeholder', 'default', 'blank', 'loading', 'spinner',
        'social', 'facebook', 'twitter', 'instagram', 'youtube',
        'favicon', 'badge', 'arrow', 'close', 'search', 'saxophone',
    ])


async def find_and_screenshot_product(product_name, browser):
    """Search for the product on Google, find a retailer page, and screenshot the product image."""
    page = await browser.new_page(viewport={'width': 1280, 'height': 900})
    try:
        # Try each retailer site
        for site_filter in SEARCH_SITES:
            query = f"{product_name} {site_filter}"
            search_url = f"https://www.google.com/search?q={requests.utils.quote(query)}"

            await page.goto(search_url, wait_until='networkidle', timeout=15000)
            await page.wait_for_timeout(1000)

            # Click first search result
            first_result = await page.query_selector('div.g a[href], a[data-ved]')
            if not first_result:
                continue

            href = await first_result.get_attribute('href')
            if not href or 'google' in href:
                # Try to find a real result link
                links = await page.query_selector_all('div.g a[href]')
                for link in links:
                    h = await link.get_attribute('href')
                    if h and not 'google' in h and h.startswith('http'):
                        href = h
                        break

            if not href or not href.startswith('http'):
                continue

            # Navigate to the product page
            try:
                await page.goto(href, wait_until='networkidle', timeout=20000)
                await page.wait_for_timeout(2000)
            except:
                continue

            # Try to find and screenshot the product image
            selectors = [
                '.product-detail img', '.product-image img', '#product-image img',
                '.product-gallery img', '.main-image img', 'img[itemprop="image"]',
                '.product-media img', '#mainImage', '.product-hero img',
                '.product-img img', '[data-zoom-image]', '.slick-current img',
                # B&H specific
                '.product-image-container img', '.main-product-image img',
                # Sweetwater specific
                '.product-image--main img', '.product-hero__image img',
                # Amazon specific
                '#landingImage', '#imgBlkFront', '#imgTagWrapperId img',
            ]

            for sel in selectors:
                el = await page.query_selector(sel)
                if el:
                    bbox = await el.bounding_box()
                    if bbox and bbox['width'] >= 100 and bbox['height'] >= 100:
                        # Try to download the actual image first
                        for attr in ['data-zoom-image', 'data-large', 'data-src', 'src']:
                            val = await el.get_attribute(attr)
                            if val and not _is_generic(val):
                                if val.startswith('//'):
                                    val = 'https:' + val
                                elif val.startswith('/'):
                                    from urllib.parse import urlparse
                                    parsed = urlparse(href)
                                    val = f"{parsed.scheme}://{parsed.netloc}{val}"
                                try:
                                    resp = requests.get(val, headers=HEADERS, timeout=10)
                                    if resp.status_code == 200 and len(resp.content) > 3000 and len(resp.content) != 13536:
                                        ct = resp.headers.get('content-type', '').lower()
                                        ext = '.webp' if 'webp' in ct else '.png' if 'png' in ct else '.jpg'
                                        return (resp.content, ext)
                                except:
                                    pass

                        # Fall back to screenshot
                        screenshot = await el.screenshot(type='jpeg', quality=90)
                        if len(screenshot) > 3000:
                            return (screenshot, '.jpg')

            # Fallback: find largest image on page
            imgs = await page.query_selector_all('img')
            best_el = None
            best_area = 0
            for img in imgs:
                try:
                    bbox = await img.bounding_box()
                    if not bbox or bbox['width'] < 200 or bbox['height'] < 200:
                        continue
                    src = await img.get_attribute('src') or ''
                    if _is_generic(src):
                        continue
                    area = bbox['width'] * bbox['height']
                    if area > best_area:
                        best_el = img
                        best_area = area
                except:
                    continue

            if best_el:
                screenshot = await best_el.screenshot(type='jpeg', quality=90)
                if len(screenshot) > 3000:
                    return (screenshot, '.jpg')

        # Last resort: Google Images screenshot
        query = f"{product_name} product photo"
        search_url = f"https://www.google.com/search?q={requests.utils.quote(query)}&tbm=isch"
        await page.goto(search_url, wait_until='networkidle', timeout=15000)
        await page.wait_for_timeout(1000)

        first_img = await page.query_selector('div[data-ri="0"] img, .rg_i')
        if first_img:
            await first_img.click()
            await page.wait_for_timeout(2000)

            large_img = await page.query_selector('img.sFlh5c.FyHeAf, img.iPVvYb, img[jsname="kn3ccd"]')
            if large_img:
                bbox = await large_img.bounding_box()
                if bbox and bbox['width'] >= 100 and bbox['height'] >= 100:
                    screenshot = await large_img.screenshot(type='jpeg', quality=90)
                    if len(screenshot) > 3000:
                        return (screenshot, '.jpg')

        return None
    except Exception as e:
        print(f"\n    Error: {e}")
        return None
    finally:
        await page.close()


async def main_async():
    os.makedirs('public/products', exist_ok=True)

    with open('data/inventory.json') as f:
        inventory = json.load(f)

    # Find items with no image
    missing = [(i, item) for i, item in enumerate(inventory) if not item.get('imageSource')]

    if not missing:
        print("All products already have images!")
        return

    print(f"Found {len(missing)} products missing images. Downloading...\n")

    pw = await async_playwright().start()
    browser = await pw.chromium.launch(headless=True)

    success = 0
    failed = []

    for idx, (i, item) in enumerate(missing):
        name = item['product']
        filename_base = slug(name)

        print(f"[{idx+1}/{len(missing)}] {name}...", end=' ', flush=True)

        result = await find_and_screenshot_product(name, browser)

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

        time.sleep(1)

    await browser.close()

    with open('data/inventory.json', 'w') as f:
        json.dump(inventory, f, indent=2)

    print(f"\n{'='*60}")
    print(f"Fixed {success}/{len(missing)} missing images.")
    if failed:
        print(f"\nStill failed ({len(failed)}):")
        for name in failed:
            print(f"  - {name}")

    print(f"\nNext steps:")
    print(f"  git add public/products/ data/inventory.json")
    print(f"  git commit -m 'Fix missing product images'")
    print(f"  git push origin main")


def main():
    asyncio.run(main_async())

if __name__ == '__main__':
    main()
