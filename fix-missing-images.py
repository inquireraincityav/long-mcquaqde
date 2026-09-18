#!/usr/bin/env python3
"""
Download clean product images for all products.
Downloads actual image files (not screenshots) from Bing Images.
Searches for "[product] product photo" to find clean product-on-white shots.

Setup:
  pip install playwright requests
  playwright install chromium

Run:
  python3 fix-missing-images.py              # only products with no image
  python3 fix-missing-images.py --all        # redo ALL products
  python3 fix-missing-images.py --visible    # show browser
"""
import json, os, hashlib, sys, asyncio, urllib.parse, re

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("Run: pip install playwright && playwright install chromium")
    sys.exit(1)

try:
    import requests
except ImportError:
    print("Run: pip install requests")
    sys.exit(1)

REDO_ALL = '--all' in sys.argv
VISIBLE = '--visible' in sys.argv
PRODUCTS_DIR = os.path.join('public', 'products')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
}

def slug(name):
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    s = name.lower().replace(' ', '-').replace('/', '-').replace('"', '').replace("'", '')
    s = ''.join(c for c in s if c.isalnum() or c == '-')
    return s[:40] + '-' + h

JUNK_KEYWORDS = [
    'logo', 'icon', 'banner', 'sprite', 'pixel', 'spacer',
    'placeholder', 'default', 'blank', 'loading', 'spinner',
    'social', 'facebook', 'twitter', 'instagram', 'youtube',
    'favicon', 'badge', 'arrow', 'close', 'avatar', 'profile',
    'no-image', 'noimage', 'tracking', '1x1', 'transparent',
    'saxophone', 'flute',
]

def is_junk(url):
    lower = (url or '').lower()
    return any(kw in lower for kw in JUNK_KEYWORDS)

def download_image(url, min_bytes=5000):
    """Download an image from URL. Returns (bytes, extension) or None."""
    try:
        if url.startswith('//'):
            url = 'https:' + url
        if not url.startswith('http'):
            return None

        resp = requests.get(url, headers=HEADERS, timeout=15, stream=True)
        if resp.status_code != 200:
            return None

        data = resp.content
        if len(data) < min_bytes:
            return None

        ct = resp.headers.get('content-type', '').lower()
        if 'webp' in ct:
            ext = '.webp'
        elif 'png' in ct:
            ext = '.png'
        elif 'jpeg' in ct or 'jpg' in ct:
            ext = '.jpg'
        elif url.lower().endswith('.webp'):
            ext = '.webp'
        elif url.lower().endswith('.png'):
            ext = '.png'
        else:
            ext = '.jpg'

        return (data, ext)
    except:
        return None


async def get_bing_image_urls(page, product_name):
    """
    Search Bing Images and extract actual source image URLs.
    Returns list of (source_url, thumbnail_width) tuples.
    """
    query = urllib.parse.quote(f"{product_name} product photo")
    url = f"https://www.bing.com/images/search?q={query}&form=HDRSC2&first=1"

    await page.goto(url, wait_until='domcontentloaded', timeout=20000)
    await page.wait_for_timeout(2500)

    # Extract image URLs from Bing's data attributes
    # Bing stores the source URL in 'm' attribute as JSON on .iusc elements
    urls = await page.evaluate("""
        () => {
            const results = [];
            // Method 1: Parse the 'm' JSON attribute on iusc divs
            document.querySelectorAll('.iusc').forEach(el => {
                try {
                    const m = JSON.parse(el.getAttribute('m') || '{}');
                    if (m.murl) {
                        results.push({ url: m.murl, w: m.purl ? 1 : 0 });
                    }
                } catch(e) {}
            });
            // Method 2: data-src on thumbnails as fallback
            if (results.length === 0) {
                document.querySelectorAll('img.mimg').forEach(img => {
                    const src = img.getAttribute('src') || img.getAttribute('data-src');
                    if (src && src.startsWith('http')) {
                        results.push({ url: src, w: 0 });
                    }
                });
            }
            return results;
        }
    """)

    return [(r['url'], r['w']) for r in urls if not is_junk(r['url'])]


async def get_image_for_product(page, product_name):
    """Get a clean product image. Returns (bytes, extension) or None."""

    # Try Bing Images - extract actual source URLs and download them
    try:
        image_urls = await get_bing_image_urls(page, product_name)

        for img_url, _ in image_urls[:8]:
            result = download_image(img_url, min_bytes=5000)
            if result:
                return result
    except Exception as e:
        print(f"(Bing extract error: {e})", end=' ')

    # Fallback: try clicking into Bing image preview and getting source URL
    try:
        query = urllib.parse.quote(f"{product_name} product")
        url = f"https://www.bing.com/images/search?q={query}&form=HDRSC2"
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(2000)

        thumbs = await page.query_selector_all('.iusc')
        for thumb in thumbs[:5]:
            try:
                await thumb.click()
                await page.wait_for_timeout(2000)

                # Get the large image src from the detail panel
                large_img = await page.query_selector('.mainImage img, img.nofocus')
                if large_img:
                    src = await large_img.get_attribute('src')
                    if src and src.startswith('http') and not is_junk(src):
                        result = download_image(src, min_bytes=5000)
                        if result:
                            return result

                # Try to close the panel and move to next
                close_btn = await page.query_selector('.close, [aria-label="Close"]')
                if close_btn:
                    await close_btn.click()
                    await page.wait_for_timeout(500)
            except:
                continue
    except Exception as e:
        print(f"(Bing click error: {e})", end=' ')

    # Last fallback: Google Images source extraction
    try:
        query = urllib.parse.quote(f"{product_name} product photo")
        url = f"https://www.google.com/search?tbm=isch&q={query}"
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(2000)

        # Click thumbnail to get full-size URL
        thumbs = await page.query_selector_all('div[data-ri] img, img.Q4LuWd, img.rg_i')
        for thumb in thumbs[:5]:
            try:
                await thumb.click()
                await page.wait_for_timeout(2500)

                # Find the full-res image in the side panel
                large_imgs = await page.query_selector_all('img[src^="http"]')
                for img in large_imgs:
                    src = await img.get_attribute('src') or ''
                    if is_junk(src) or 'gstatic' in src or 'google' in src:
                        continue
                    bbox = await img.bounding_box()
                    if bbox and bbox['width'] >= 150 and bbox['height'] >= 150:
                        result = download_image(src, min_bytes=5000)
                        if result:
                            return result
            except:
                continue
    except Exception as e:
        print(f"(Google error: {e})", end=' ')

    return None


async def main_async():
    os.makedirs(PRODUCTS_DIR, exist_ok=True)

    with open('data/inventory.json') as f:
        inventory = json.load(f)

    if REDO_ALL:
        targets = list(enumerate(inventory))
        print(f"Redoing ALL {len(targets)} products.")
    else:
        targets = [(i, item) for i, item in enumerate(inventory) if not item.get('imageSource')]
        if not targets:
            print("All products already have images! Use --all to redo them.")
            return

    print(f"Processing {len(targets)} products.")
    print(f"Mode: {'visible' if VISIBLE else 'headless'} (add --visible to see browser)")
    print()

    pw = await async_playwright().start()
    browser = await pw.chromium.launch(
        headless=not VISIBLE,
        args=['--disable-blink-features=AutomationControlled'],
    )
    context = await browser.new_context(
        viewport={'width': 1280, 'height': 900},
        user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        locale='en-US',
    )
    await context.add_init_script("""
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    """)

    success = 0
    failed = []

    for idx, (i, item) in enumerate(targets):
        name = item['product']
        filename_base = slug(name)

        # Delete old image file if redoing
        if REDO_ALL and item.get('imageSource'):
            old_path = os.path.join('public', item['imageSource'].lstrip('/'))
            if os.path.exists(old_path):
                os.remove(old_path)

        print(f"[{idx+1}/{len(targets)}] {name}...", end=' ', flush=True)

        page = await context.new_page()
        try:
            result = await get_image_for_product(page, name)
        except Exception as e:
            print(f"error: {e}", end=' ')
            result = None
        finally:
            await page.close()

        if result:
            data, ext = result
            filename = filename_base + ext
            filepath = os.path.join(PRODUCTS_DIR, filename)
            with open(filepath, 'wb') as f:
                f.write(data)
            item['imageSource'] = f'/products/{filename}'
            print(f"OK ({len(data)//1024}KB)")
            success += 1
        else:
            print("FAILED")
            failed.append(name)

        await asyncio.sleep(1.5)

    await browser.close()
    await pw.stop()

    with open('data/inventory.json', 'w') as f:
        json.dump(inventory, f, indent=2)

    print(f"\n{'='*60}")
    print(f"Got {success}/{len(targets)} product images.")
    if failed:
        print(f"\nFailed ({len(failed)}):")
        for name in failed:
            print(f"  - {name}")

    if success > 0:
        print(f"\nNext steps:")
        print(f"  git add public/products/ data/inventory.json")
        print(f"  git commit -m 'Update product images'")
        print(f"  git push origin main")


if __name__ == '__main__':
    asyncio.run(main_async())
