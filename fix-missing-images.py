#!/usr/bin/env python3
"""
Download real product images for products with null imageSource.
Goes directly to retailer search pages to avoid Google bot detection.

Setup:
  pip install playwright
  playwright install chromium

Run:
  python3 fix-missing-images.py
  python3 fix-missing-images.py --visible   # show browser for debugging
"""
import json, os, re, hashlib, time, sys, asyncio

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("Run: pip install playwright && playwright install chromium")
    sys.exit(1)

VISIBLE = '--visible' in sys.argv

def slug(name):
    h = hashlib.md5(name.encode()).hexdigest()[:8]
    s = name.lower().replace(' ', '-').replace('/', '-').replace('"', '').replace("'", '')
    s = ''.join(c for c in s if c.isalnum() or c == '-')
    return s[:40] + '-' + h

def short_query(name):
    """Extract brand + model for cleaner search (e.g. 'Pioneer DDJ-FLX6')."""
    parts = name.split()
    # Take first 2-3 words (brand + model), skip generic descriptors
    query_parts = []
    for p in parts:
        if len(query_parts) >= 3:
            break
        if p.lower() in ('the', 'a', 'an', 'with', 'and', 'for', 'pro', 'series'):
            continue
        query_parts.append(p)
    return ' '.join(query_parts) if query_parts else name[:30]

def is_junk_url(url):
    lower = url.lower()
    return any(kw in lower for kw in [
        'logo', 'icon', 'banner', 'sprite', 'pixel', 'spacer',
        'placeholder', 'default', 'blank', 'loading', 'spinner',
        'social', 'facebook', 'twitter', 'instagram', 'youtube',
        'favicon', 'badge', 'arrow', 'close', 'search-icon',
        'saxophone', 'flute', 'no-image', 'noimage',
        'data:image/svg', 'data:image/gif',
    ])


async def try_bhphoto(page, product_name):
    """Search B&H Photo directly and get product image."""
    query = short_query(product_name)
    url = f"https://www.bhphotovideo.com/c/search?q={query.replace(' ', '%20')}"
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(3000)

        # Find first product image in search results
        selectors = [
            'img[data-selenium="miniProductPageImg"]',
            '.product-image img',
            'img[loading="lazy"][src*="bhphoto"]',
            '.sku-grid img',
        ]
        for sel in selectors:
            imgs = await page.query_selector_all(sel)
            for img in imgs:
                src = await img.get_attribute('src') or ''
                if is_junk_url(src):
                    continue
                bbox = await img.bounding_box()
                if bbox and bbox['width'] >= 80 and bbox['height'] >= 80:
                    screenshot = await img.screenshot(type='jpeg', quality=92)
                    if len(screenshot) > 2000:
                        return screenshot
    except Exception as e:
        print(f"B&H error: {e}", end=' ')
    return None


async def try_sweetwater(page, product_name):
    """Search Sweetwater directly and get product image."""
    query = short_query(product_name)
    url = f"https://www.sweetwater.com/store/search?s={query.replace(' ', '+')}"
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(3000)

        selectors = [
            '.product-listing__media img',
            '.search-results img',
            '.product-card img',
            '.product-image img',
        ]
        for sel in selectors:
            imgs = await page.query_selector_all(sel)
            for img in imgs:
                src = await img.get_attribute('src') or ''
                if is_junk_url(src):
                    continue
                bbox = await img.bounding_box()
                if bbox and bbox['width'] >= 80 and bbox['height'] >= 80:
                    screenshot = await img.screenshot(type='jpeg', quality=92)
                    if len(screenshot) > 2000:
                        return screenshot
    except Exception as e:
        print(f"SW error: {e}", end=' ')
    return None


async def try_google_images(page, product_name):
    """Search Google Images and screenshot the first result."""
    query = f"{product_name} product"
    url = f"https://www.google.com/search?tbm=isch&q={query.replace(' ', '+')}"
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(2000)

        # Click first image thumbnail to open the preview
        thumbnails = await page.query_selector_all('div[data-ri] img, .rg_i, img.Q4LuWd')
        for thumb in thumbnails[:3]:
            try:
                bbox = await thumb.bounding_box()
                if not bbox or bbox['width'] < 50:
                    continue
                await thumb.click()
                await page.wait_for_timeout(2500)

                # Find the large preview image
                large_selectors = [
                    'img.sFlh5c.FyHeAf',
                    'img.iPVvYb',
                    'img[jsname="kn3ccd"]',
                    'img.r48jcc',
                    'c-wiz img[src^="http"]',
                ]
                for sel in large_selectors:
                    large = await page.query_selector(sel)
                    if large:
                        lbox = await large.bounding_box()
                        if lbox and lbox['width'] >= 100 and lbox['height'] >= 100:
                            screenshot = await large.screenshot(type='jpeg', quality=92)
                            if len(screenshot) > 2000:
                                return screenshot
            except:
                continue

        # Fallback: screenshot first decent thumbnail
        for thumb in thumbnails[:5]:
            try:
                bbox = await thumb.bounding_box()
                if bbox and bbox['width'] >= 80 and bbox['height'] >= 80:
                    screenshot = await thumb.screenshot(type='jpeg', quality=92)
                    if len(screenshot) > 1500:
                        return screenshot
            except:
                continue

    except Exception as e:
        print(f"GI error: {e}", end=' ')
    return None


async def try_long_mcquade(page, product_name):
    """Search Long & McQuade directly."""
    query = short_query(product_name)
    url = f"https://www.long-mcquade.com/search?q={query.replace(' ', '+')}"
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(3000)

        imgs = await page.query_selector_all('.product-image img, .search-result img, .card img')
        for img in imgs:
            src = await img.get_attribute('src') or ''
            if is_junk_url(src) or '13536' in src:
                continue
            bbox = await img.bounding_box()
            if bbox and bbox['width'] >= 80 and bbox['height'] >= 80:
                screenshot = await img.screenshot(type='jpeg', quality=92)
                if len(screenshot) > 2000 and len(screenshot) != 13536:
                    return screenshot
    except Exception as e:
        print(f"L&M error: {e}", end=' ')
    return None


async def main_async():
    os.makedirs('public/products', exist_ok=True)

    with open('data/inventory.json') as f:
        inventory = json.load(f)

    missing = [(i, item) for i, item in enumerate(inventory) if not item.get('imageSource')]

    if not missing:
        print("All products already have images!")
        return

    print(f"Found {len(missing)} products missing images.")
    print(f"Mode: {'visible' if VISIBLE else 'headless'} (add --visible to see browser)")
    print()

    pw = await async_playwright().start()
    browser = await pw.chromium.launch(headless=not VISIBLE)
    context = await browser.new_context(
        viewport={'width': 1280, 'height': 900},
        user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    )

    success = 0
    failed = []

    strategies = [
        ('B&H', try_bhphoto),
        ('Sweetwater', try_sweetwater),
        ('Google Images', try_google_images),
        ('Long & McQuade', try_long_mcquade),
    ]

    for idx, (i, item) in enumerate(missing):
        name = item['product']
        filename_base = slug(name)

        print(f"[{idx+1}/{len(missing)}] {name}")

        screenshot = None
        for label, strategy in strategies:
            print(f"  Trying {label}...", end=' ', flush=True)
            page = await context.new_page()
            try:
                screenshot = await strategy(page, name)
            except Exception as e:
                print(f"error: {e}", end=' ')
            finally:
                await page.close()

            if screenshot:
                print(f"OK ({len(screenshot)//1024}KB)")
                break
            else:
                print("no image")

        if screenshot:
            filename = filename_base + '.jpg'
            filepath = os.path.join('public', 'products', filename)
            with open(filepath, 'wb') as f:
                f.write(screenshot)
            item['imageSource'] = f'/products/{filename}'
            success += 1
        else:
            print("  FAILED - no source found")
            failed.append(name)

        # Brief pause between products
        await asyncio.sleep(1.5)

    await browser.close()
    await pw.stop()

    with open('data/inventory.json', 'w') as f:
        json.dump(inventory, f, indent=2)

    print(f"\n{'='*60}")
    print(f"Fixed {success}/{len(missing)} missing images.")
    if failed:
        print(f"\nStill failed ({len(failed)}):")
        for name in failed:
            print(f"  - {name}")

    if success > 0:
        print(f"\nNext steps:")
        print(f"  git pull origin main")
        print(f"  git add public/products/ data/inventory.json")
        print(f"  git commit -m 'Add missing product images'")
        print(f"  git push origin main")


if __name__ == '__main__':
    asyncio.run(main_async())
