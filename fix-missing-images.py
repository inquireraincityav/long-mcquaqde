#!/usr/bin/env python3
"""
Download real product images for products with null imageSource.
Uses Bing Images (less bot detection than Google) and generic image finding.

Setup:
  pip install playwright
  playwright install chromium

Run:
  python3 fix-missing-images.py
  python3 fix-missing-images.py --visible   # show browser for debugging
"""
import json, os, hashlib, time, sys, asyncio, urllib.parse

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

JUNK_KEYWORDS = [
    'logo', 'icon', 'banner', 'sprite', 'pixel', 'spacer',
    'placeholder', 'default', 'blank', 'loading', 'spinner',
    'social', 'facebook', 'twitter', 'instagram', 'youtube',
    'favicon', 'badge', 'arrow', 'close', 'search-icon',
    'no-image', 'noimage', 'avatar', 'profile', 'cart',
    'data:image/svg', 'data:image/gif', 'data:image/png',
    '1x1', 'transparent', 'tracking',
]

def is_junk(src):
    lower = (src or '').lower()
    return any(kw in lower for kw in JUNK_KEYWORDS)


async def find_largest_image(page, min_w=120, min_h=120):
    """Find and screenshot the largest non-junk image on the current page."""
    imgs = await page.query_selector_all('img')
    best = None
    best_area = 0
    for img in imgs:
        try:
            src = await img.get_attribute('src') or ''
            if is_junk(src):
                continue
            bbox = await img.bounding_box()
            if not bbox or bbox['width'] < min_w or bbox['height'] < min_h:
                continue
            area = bbox['width'] * bbox['height']
            if area > best_area:
                best = img
                best_area = area
        except:
            continue

    if best:
        try:
            screenshot = await best.screenshot(type='jpeg', quality=90)
            if len(screenshot) > 1500:
                return screenshot
        except:
            pass
    return None


async def try_bing_images(page, product_name):
    """Search Bing Images — less aggressive bot detection than Google."""
    query = urllib.parse.quote(f"{product_name}")
    url = f"https://www.bing.com/images/search?q={query}&form=HDRSC2"
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(2000)

        # Click first thumbnail to open large preview
        thumbs = await page.query_selector_all('.iusc img, .mimg, img.mimg')
        for thumb in thumbs[:3]:
            try:
                bbox = await thumb.bounding_box()
                if not bbox or bbox['width'] < 40:
                    continue
                await thumb.click()
                await page.wait_for_timeout(2000)

                # Find the large preview image
                large = await page.query_selector('.imgContainer img, img.nofocus, .mainImage img')
                if large:
                    lbox = await large.bounding_box()
                    if lbox and lbox['width'] >= 150 and lbox['height'] >= 150:
                        screenshot = await large.screenshot(type='jpeg', quality=90)
                        if len(screenshot) > 2000:
                            return screenshot

                # Try generic largest image approach on the overlay
                result = await find_largest_image(page, 150, 150)
                if result:
                    return result
            except:
                continue

        # Fallback: just screenshot the biggest thumbnail
        for thumb in thumbs[:5]:
            try:
                bbox = await thumb.bounding_box()
                if bbox and bbox['width'] >= 80 and bbox['height'] >= 80:
                    screenshot = await thumb.screenshot(type='jpeg', quality=90)
                    if len(screenshot) > 1500:
                        return screenshot
            except:
                continue

    except Exception as e:
        print(f"(Bing error: {e})", end=' ')
    return None


async def try_google_images(page, product_name):
    """Search Google Images as fallback."""
    query = urllib.parse.quote(f"{product_name}")
    url = f"https://www.google.com/search?tbm=isch&q={query}"
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(2000)

        # Try clicking a thumbnail
        thumbs = await page.query_selector_all('div[data-ri] img, img.Q4LuWd, img.rg_i')
        for thumb in thumbs[:3]:
            try:
                bbox = await thumb.bounding_box()
                if not bbox or bbox['width'] < 40:
                    continue
                await thumb.click()
                await page.wait_for_timeout(2500)

                # Try to find the large image panel
                result = await find_largest_image(page, 150, 150)
                if result:
                    return result
            except:
                continue

        # Fallback: screenshot largest visible thumbnail
        result = await find_largest_image(page, 60, 60)
        if result:
            return result

    except Exception as e:
        print(f"(Google error: {e})", end=' ')
    return None


async def try_direct_site(page, product_name, site_name, search_url_fn):
    """Search a retailer directly using generic image finding."""
    try:
        url = search_url_fn(product_name)
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(3000)

        # Scroll down a bit to trigger lazy-loaded images
        await page.evaluate('window.scrollBy(0, 300)')
        await page.wait_for_timeout(1000)

        result = await find_largest_image(page, 80, 80)
        if result:
            return result

    except Exception as e:
        print(f"({site_name} error: {e})", end=' ')
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
    browser = await pw.chromium.launch(
        headless=not VISIBLE,
        args=['--disable-blink-features=AutomationControlled']
    )
    context = await browser.new_context(
        viewport={'width': 1280, 'height': 900},
        user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        locale='en-US',
    )

    # Mask webdriver detection
    await context.add_init_script("""
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    """)

    success = 0
    failed = []

    strategies = [
        ('Bing Images', lambda page, name: try_bing_images(page, name)),
        ('B&H Photo', lambda page, name: try_direct_site(page, name, 'B&H',
            lambda n: f"https://www.bhphotovideo.com/c/search?q={urllib.parse.quote(n)}")),
        ('Sweetwater', lambda page, name: try_direct_site(page, name, 'Sweetwater',
            lambda n: f"https://www.sweetwater.com/store/search?s={urllib.parse.quote(n)}")),
        ('Google Images', lambda page, name: try_google_images(page, name)),
    ]

    for idx, (i, item) in enumerate(missing):
        name = item['product']
        filename_base = slug(name)

        print(f"[{idx+1}/{len(missing)}] {name}")

        screenshot = None
        for label, strategy in strategies:
            print(f"  {label}...", end=' ', flush=True)
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
                print("miss")

        if screenshot:
            filename = filename_base + '.jpg'
            filepath = os.path.join('public', 'products', filename)
            with open(filepath, 'wb') as f:
                f.write(screenshot)
            item['imageSource'] = f'/products/{filename}'
            success += 1
        else:
            print("  FAILED")
            failed.append(name)

        await asyncio.sleep(1)

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
        print(f"  git add public/products/ data/inventory.json")
        print(f"  git commit -m 'Add missing product images'")
        print(f"  git push origin main")


if __name__ == '__main__':
    asyncio.run(main_async())
