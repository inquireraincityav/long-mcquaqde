#!/usr/bin/env python3
"""
Download clean product images with 3-tier fallback:
  1. Download actual image file from Bing Images source URLs
  2. Screenshot the product image from Bing preview panel
  3. Generate a styled placeholder render with disclaimer

Setup:
  pip install playwright requests
  playwright install chromium

Run:
  python3 fix-missing-images.py              # only products with no image
  python3 fix-missing-images.py --all        # redo ALL products
  python3 fix-missing-images.py --visible    # show browser
"""
import json, os, hashlib, sys, asyncio, urllib.parse

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

CATEGORY_ICONS = {
    'Speakers': '🔊',
    'Microphones': '🎤',
    'DJ Equipment': '🎛️',
    'Recording': '🎚️',
    'Lighting': '💡',
    'Visual': '📽️',
    'Mixers & Extras': '🎛️',
    'Backline': '🎸',
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
        resp = requests.get(url, headers=HEADERS, timeout=15)
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


# ── TIER 1: Download actual image files from Bing source URLs ──

async def tier1_download(page, product_name):
    """Extract source image URLs from Bing and download the actual files."""
    query = urllib.parse.quote(f"{product_name} product photo")
    url = f"https://www.bing.com/images/search?q={query}&form=HDRSC2&first=1"

    await page.goto(url, wait_until='domcontentloaded', timeout=20000)
    await page.wait_for_timeout(2500)

    urls = await page.evaluate("""
        () => {
            const results = [];
            document.querySelectorAll('.iusc').forEach(el => {
                try {
                    const m = JSON.parse(el.getAttribute('m') || '{}');
                    if (m.murl) results.push(m.murl);
                } catch(e) {}
            });
            if (results.length === 0) {
                document.querySelectorAll('img.mimg').forEach(img => {
                    const src = img.getAttribute('src') || img.getAttribute('data-src');
                    if (src && src.startsWith('http')) results.push(src);
                });
            }
            return results;
        }
    """)

    for img_url in urls[:8]:
        if is_junk(img_url):
            continue
        result = download_image(img_url, min_bytes=5000)
        if result:
            return result
    return None


# ── TIER 2: Screenshot the product image from Bing/Google preview ──

async def tier2_screenshot(page, product_name):
    """Click into image search results and screenshot the large preview."""

    # Try Bing first
    query = urllib.parse.quote(f"{product_name} product")
    url = f"https://www.bing.com/images/search?q={query}&form=HDRSC2"
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(2000)

        thumbs = await page.query_selector_all('.iusc')
        for thumb in thumbs[:5]:
            try:
                await thumb.click()
                await page.wait_for_timeout(2500)

                # Find the large preview — try multiple selectors
                for sel in ['img.nofocus', '.mainImage img', '.imgContainer img']:
                    large_img = await page.query_selector(sel)
                    if large_img:
                        bbox = await large_img.bounding_box()
                        if bbox and bbox['width'] >= 120 and bbox['height'] >= 120:
                            screenshot = await large_img.screenshot(type='jpeg', quality=92)
                            if len(screenshot) > 3000:
                                return (screenshot, '.jpg')

                # Generic: find largest visible image
                imgs = await page.query_selector_all('img')
                best, best_area = None, 0
                for img in imgs:
                    try:
                        src = await img.get_attribute('src') or ''
                        if is_junk(src) or 'bing' in src.lower():
                            continue
                        bbox = await img.bounding_box()
                        if bbox and bbox['width'] >= 150 and bbox['height'] >= 150:
                            area = bbox['width'] * bbox['height']
                            if area > best_area:
                                best, best_area = img, area
                    except:
                        continue
                if best:
                    screenshot = await best.screenshot(type='jpeg', quality=92)
                    if len(screenshot) > 3000:
                        return (screenshot, '.jpg')

                # Close panel for next attempt
                close_btn = await page.query_selector('.close, [aria-label="Close"]')
                if close_btn:
                    await close_btn.click()
                    await page.wait_for_timeout(500)
            except:
                continue
    except Exception as e:
        print(f"(Bing screenshot err: {e})", end=' ')

    # Try Google Images
    query = urllib.parse.quote(f"{product_name} product photo")
    url = f"https://www.google.com/search?tbm=isch&q={query}"
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(2000)

        thumbs = await page.query_selector_all('div[data-ri] img, img.Q4LuWd, img.rg_i')
        for thumb in thumbs[:5]:
            try:
                bbox = await thumb.bounding_box()
                if not bbox or bbox['width'] < 40:
                    continue
                await thumb.click()
                await page.wait_for_timeout(2500)

                # Find large preview images
                imgs = await page.query_selector_all('img[src^="http"]')
                for img in imgs:
                    src = await img.get_attribute('src') or ''
                    if is_junk(src) or 'gstatic' in src or 'google' in src:
                        continue
                    bbox = await img.bounding_box()
                    if bbox and bbox['width'] >= 150 and bbox['height'] >= 150:
                        screenshot = await img.screenshot(type='jpeg', quality=92)
                        if len(screenshot) > 3000:
                            return (screenshot, '.jpg')
            except:
                continue
    except Exception as e:
        print(f"(Google screenshot err: {e})", end=' ')

    return None


# ── TIER 3: Generate styled placeholder render ──

async def tier3_render(context, product_name, category):
    """Generate a clean placeholder image with product name and disclaimer."""
    icon = CATEGORY_ICONS.get(category, '📦')

    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    width: 400px; height: 400px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: linear-gradient(145deg, #f8f8f8, #e8e8e8);
    font-family: -apple-system, 'Segoe UI', sans-serif;
    text-align: center; padding: 32px;
  }}
  .icon {{ font-size: 72px; margin-bottom: 20px; filter: grayscale(30%); }}
  .name {{
    font-size: 18px; font-weight: 600; color: #333;
    line-height: 1.3; margin-bottom: 16px;
    max-width: 320px;
    display: -webkit-box; -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; overflow: hidden;
  }}
  .disclaimer {{
    font-size: 11px; color: #999; letter-spacing: 0.3px;
    border-top: 1px solid #ddd; padding-top: 12px;
    margin-top: auto;
  }}
</style></head>
<body>
  <div class="icon">{icon}</div>
  <div class="name">{product_name}</div>
  <div class="disclaimer">Product render &middot; actual image pending</div>
</body></html>"""

    page = await context.new_page()
    try:
        await page.set_viewport_size({'width': 400, 'height': 400})
        await page.set_content(html, wait_until='networkidle')
        await page.wait_for_timeout(300)
        screenshot = await page.screenshot(type='jpeg', quality=92)
        return (screenshot, '.jpg')
    finally:
        await page.close()


# ── Main ──

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
    print(f"Mode: {'visible' if VISIBLE else 'headless'} (add --visible to see browser)\n")

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

    stats = {'tier1': 0, 'tier2': 0, 'tier3': 0, 'failed': 0}
    failed = []

    for idx, (i, item) in enumerate(targets):
        name = item['product']
        category = item.get('category', '')
        filename_base = slug(name)

        # Delete old image if redoing
        if REDO_ALL and item.get('imageSource'):
            old_path = os.path.join('public', item['imageSource'].lstrip('/'))
            if os.path.exists(old_path):
                os.remove(old_path)

        print(f"[{idx+1}/{len(targets)}] {name}")

        result = None
        tier_used = None

        # TIER 1: Download actual image file
        print(f"  Tier 1 (download)...", end=' ', flush=True)
        page = await context.new_page()
        try:
            result = await tier1_download(page, name)
        except Exception as e:
            print(f"err: {e}", end=' ')
        finally:
            await page.close()

        if result:
            tier_used = 'tier1'
            print(f"OK ({len(result[0])//1024}KB)")
        else:
            print("miss")

            # TIER 2: Screenshot product from image search preview
            print(f"  Tier 2 (screenshot)...", end=' ', flush=True)
            page = await context.new_page()
            try:
                result = await tier2_screenshot(page, name)
            except Exception as e:
                print(f"err: {e}", end=' ')
            finally:
                await page.close()

            if result:
                tier_used = 'tier2'
                print(f"OK ({len(result[0])//1024}KB)")
            else:
                print("miss")

                # TIER 3: Generate placeholder render
                print(f"  Tier 3 (render)...", end=' ', flush=True)
                try:
                    result = await tier3_render(context, name, category)
                    tier_used = 'tier3'
                    print("OK (placeholder)")
                except Exception as e:
                    print(f"err: {e}")

        if result:
            data, ext = result
            filename = filename_base + ext
            filepath = os.path.join(PRODUCTS_DIR, filename)
            with open(filepath, 'wb') as f:
                f.write(data)
            item['imageSource'] = f'/products/{filename}'
            item['isRender'] = (tier_used == 'tier3')
            if tier_used != 'tier3' and 'isRender' in item:
                del item['isRender']
            stats[tier_used] += 1
        else:
            print("  FAILED - all tiers exhausted")
            failed.append(name)
            stats['failed'] += 1

        await asyncio.sleep(1.5)

    await browser.close()
    await pw.stop()

    with open('data/inventory.json', 'w') as f:
        json.dump(inventory, f, indent=2)

    print(f"\n{'='*60}")
    total = stats['tier1'] + stats['tier2'] + stats['tier3']
    print(f"Got {total}/{len(targets)} product images:")
    print(f"  Tier 1 (downloaded):    {stats['tier1']}")
    print(f"  Tier 2 (screenshot):    {stats['tier2']}")
    print(f"  Tier 3 (render):        {stats['tier3']}")
    if stats['failed']:
        print(f"  Failed:                 {stats['failed']}")

    render_count = sum(1 for item in inventory if item.get('isRender'))
    if render_count:
        print(f"\n⚠ {render_count} products have placeholder renders (need real images later)")

    if failed:
        print(f"\nFailed completely:")
        for name in failed:
            print(f"  - {name}")

    print(f"\nNext steps:")
    print(f"  git add public/products/ data/inventory.json")
    print(f"  git commit -m 'Update product images'")
    print(f"  git push origin main")


if __name__ == '__main__':
    asyncio.run(main_async())
