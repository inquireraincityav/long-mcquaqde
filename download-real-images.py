#!/usr/bin/env python3
"""
Download real product images for all 74 inventory items.
Uses multiple strategies:
  1. Playwright browser to find and download product images from L&M
  2. Simple requests scraping of L&M product pages
  3. Google Images search
  4. Screenshot of product page (cropped to product image area)

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

MIN_GOOD_SIZE = 3000


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
        await page.wait_for_timeout(2000)

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
                for attr in ['data-zoom-image', 'data-large', 'data-src', 'src']:
                    val = await el.get_attribute(attr)
                    if val and not _is_generic(val):
                        img_url = val
                        break
                if img_url:
                    break

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
            if img_url.startswith('//'):
                img_url = 'https:' + img_url
            elif img_url.startswith('/'):
                from urllib.parse import urlparse
                parsed = urlparse(source_link)
                img_url = f"{parsed.scheme}://{parsed.netloc}{img_url}"

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


async def screenshot_product_image(source_link, product_name, browser):
    """Take a screenshot of the product page and crop to the product image area."""
    page = await browser.new_page(viewport={'width': 1280, 'height': 900})
    try:
        await page.goto(source_link, wait_until='networkidle', timeout=20000)
        await page.wait_for_timeout(2000)

        # Try to find the product image element and screenshot just that
        selectors = [
            '.product-detail img',
            '.product-image img',
            '#product-image img',
            '.product-gallery img',
            '.main-image img',
            'img[itemprop="image"]',
            '.slick-current img',
            '.product-media img',
            '#mainImage',
        ]

        for sel in selectors:
            el = await page.query_selector(sel)
            if el:
                bbox = await el.bounding_box()
                if bbox and bbox['width'] >= 100 and bbox['height'] >= 100:
                    screenshot = await el.screenshot(type='jpeg', quality=90)
                    if len(screenshot) > MIN_GOOD_SIZE:
                        return (screenshot, '.jpg')

        # Fallback: find the largest visible image and screenshot it
        imgs = await page.query_selector_all('img')
        best_el = None
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
                    best_el = img
                    best_area = area
            except:
                continue

        if best_el:
            screenshot = await best_el.screenshot(type='jpeg', quality=90)
            if len(screenshot) > MIN_GOOD_SIZE:
                return (screenshot, '.jpg')

        # Last resort: screenshot the top-center of the page (product area)
        screenshot = await page.screenshot(
            type='jpeg',
            quality=90,
            clip={'x': 200, 'y': 100, 'width': 600, 'height': 500}
        )
        if len(screenshot) > MIN_GOOD_SIZE:
            return (screenshot, '.jpg')

        return None
    except Exception as e:
        print(f"\n    Screenshot error: {e}")
        return None
    finally:
        await page.close()


async def screenshot_google_image(product_name, browser):
    """Search Google Images and screenshot the first result."""
    page = await browser.new_page(viewport={'width': 1280, 'height': 900})
    try:
        query = f"{product_name} product photo"
        url = f"https://www.google.com/search?q={requests.utils.quote(query)}&tbm=isch&safe=active"
        await page.goto(url, wait_until='networkidle', timeout=15000)
        await page.wait_for_timeout(1000)

        # Click first image result
        first_img = await page.query_selector('div[data-ri="0"] img, .rg_i')
        if first_img:
            await first_img.click()
            await page.wait_for_timeout(2000)

            # Find the large preview image
            large_img = await page.query_selector('img.sFlh5c.FyHeAf, img.iPVvYb, img[jsname="kn3ccd"]')
            if large_img:
                bbox = await large_img.bounding_box()
                if bbox and bbox['width'] >= 100 and bbox['height'] >= 100:
                    screenshot = await large_img.screenshot(type='jpeg', quality=90)
                    if len(screenshot) > MIN_GOOD_SIZE:
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
                area = bbox['width'] * bbox['height']
                if area > best_area:
                    best_el = img
                    best_area = area
            except:
                continue

        if best_el:
            screenshot = await best_el.screenshot(type='jpeg', quality=90)
            if len(screenshot) > MIN_GOOD_SIZE:
                return (screenshot, '.jpg')

        return None
    except Exception as e:
        print(f"\n    Google screenshot error: {e}")
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

        soup = BeautifulSoup(resp.text, 'html.parser')

        for script in soup.find_all('script'):
            text = script.string or ''
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

        if not img_url:
            for img in soup.find_all('img'):
                src = img.get('data-src') or img.get('src') or ''
                if not src or _is_generic(src):
                    continue
                if any(kw in src.lower() for kw in ['product', 'upload', 'media', 'image', 'item']):
                    img_url = src
                    break

        if not img_url:
            return None

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
    lower = url.lower()
    return any(kw in lower for kw in [
        'logo', 'icon', 'banner', 'sprite', 'pixel', 'spacer',
        'placeholder', 'default', 'blank', 'loading', 'spinner',
        'social', 'facebook', 'twitter', 'instagram', 'youtube',
        'favicon', 'badge', 'arrow', 'close', 'search',
    ])


def _get_ext(content_type, url):
    ct = content_type.lower()
    if 'webp' in ct:
        return '.webp'
    elif 'png' in ct:
        return '.png'
    elif 'gif' in ct:
        return '.gif'
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
    screenshot_items = []

    for i, item in enumerate(inventory):
        name = item['product']
        link = item.get('sourceLink')
        filename_base = slug(name)

        existing = item.get('imageSource', '')
        if existing:
            existing_path = 'public' + existing
            if os.path.exists(existing_path) and os.path.getsize(existing_path) > MIN_GOOD_SIZE:
                size = os.path.getsize(existing_path)
                if size != 13536:
                    print(f"[{i+1}/{len(inventory)}] {name[:55]}... SKIP (already good {size//1024}KB)")
                    success += 1
                    continue

        print(f"[{i+1}/{len(inventory)}] {name[:55]}...", end=' ', flush=True)

        result = None

        # Strategy 1: Playwright image download
        if browser and link:
            result = await download_with_playwright(link, name, browser)
            if result:
                print("OK (Playwright)", end=' ')

        # Strategy 2: Simple requests scraping
        if not result and link:
            result = download_with_requests(link, name)
            if result:
                print("OK (requests)", end=' ')

        # Strategy 3: Google Images download
        if not result:
            result = download_from_google_images(name)
            if result:
                print("OK (Google)", end=' ')

        # Strategy 4: Screenshot of product page (cropped to product image)
        if not result and browser and link:
            result = await screenshot_product_image(link, name, browser)
            if result:
                print("OK (screenshot)", end=' ')

        # Strategy 5: Screenshot from Google Images
        if not result and browser:
            result = await screenshot_google_image(name, browser)
            if result:
                print("OK (Google screenshot)", end=' ')

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

    with open('data/inventory.json', 'w') as f:
        json.dump(inventory, f, indent=2)

    print(f"\n{'='*60}")
    print(f"Done! {success}/{len(inventory)} images downloaded.")
    if failed:
        print(f"\nFailed ({len(failed)}):")
        for name in failed:
            print(f"  - {name}")
        print(f"\nFailed items will use category placeholder icons in the app.")

    print(f"\nNext steps:")
    print(f"  git add public/products/ data/inventory.json")
    print(f"  git commit -m 'Add real product images'")
    print(f"  git push origin main")


def main():
    asyncio.run(main_async())


if __name__ == '__main__':
    main()
