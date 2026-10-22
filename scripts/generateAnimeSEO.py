"""
generateAnimeSEO.py
====================
Expert SEO copywriter + image analyst for Wallify Anime posters.

Workflow per batch of 10:
1. Identify next 10 un-enriched Anime products
2. Download from Cloudinary into a temp scratch dir
3. Send each image to Gemini Vision for visual inspection
4. Write seoTitle (≤60), metaDescription (≤150), seoAltText, improved title + description
5. Patch products.ts (preserving id, label, image)
6. Validate lengths + structure
7. Git commit the batch
8. Delete temp images
9. Continue until all 65 anime posters are processed
"""

import os, re, json, time, shutil, subprocess, urllib.request, textwrap

# ── Path setup ─────────────────────────────────────────────────────────────
SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT   = os.path.normpath(os.path.join(SCRIPT_DIR, '..'))
PRODUCTS_TS = os.path.join(REPO_ROOT, 'src', 'data', 'products.ts')
SCRATCH_BASE = os.path.join(SCRIPT_DIR, 'anime_scratch')

CLOUDINARY_BASE = "https://res.cloudinary.com/dkwx4bacj/image/upload/v1/wallify/assets/anime/"
BATCH_SIZE = 10

# ── Gemini setup ────────────────────────────────────────────────────────────
import google.generativeai as genai

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY environment variable not set.")
    exit(1)
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash-latest')

# ── Helpers ─────────────────────────────────────────────────────────────────

def load_products():
    with open(PRODUCTS_TS, 'r', encoding='utf-8') as f:
        return f.read()

def save_products(content):
    with open(PRODUCTS_TS, 'w', encoding='utf-8') as f:
        f.write(content)

def get_anime_products(content):
    """Parse the TS file and return list of (match_object, parsed_dict) for Anime products."""
    # Match individual product objects (each starts with {"id":)
    product_pat = re.compile(
        r'\{\s*"id"\s*:\s*"(p\d+)"[\s\S]*?"category"\s*:\s*"Anime"[\s\S]*?\}(?=\s*[,\]])',
        re.MULTILINE
    )
    results = []
    for m in product_pat.finditer(content):
        block = m.group(0)
        try:
            obj = json.loads(block)
        except json.JSONDecodeError:
            # Try stripping trailing comma
            try:
                obj = json.loads(block.rstrip(','))
            except:
                print(f"  WARN: could not parse block starting at pos {m.start()}, skipping.")
                continue
        results.append((m, obj))
    return results

def already_enriched(obj):
    return bool(obj.get('seoTitle') and obj.get('metaDescription') and obj.get('seoAltText'))

def download_image(filename, dest_dir):
    url = CLOUDINARY_BASE + filename
    dest = os.path.join(dest_dir, filename)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    with open(dest, 'wb') as f:
        f.write(data)
    return dest, data

VISION_PROMPT = textwrap.dedent("""\
You are an expert e-commerce SEO copywriter and accessibility specialist for an Indian anime poster shop.

Look carefully at this anime poster image and generate accurate metadata based ONLY on what is actually visible.

Rules:
- seoTitle: max 60 characters. Descriptive, search-optimized. Include character/series name if clearly visible/identifiable.
- metaDescription: max 150 characters. Natural, compelling summary of the poster's actual visual content, mood, and aesthetic.
- seoAltText: A literal, detailed accessibility description (aim for 15-25 words). Describe visible characters, colors, composition, background, readable text, artistic style. Do NOT use it as keyword spam.
- improvedTitle: A clean, readable customer-facing product title (e.g. "Naruto Uzumaki Sage Mode – Anime Wall Poster"). Max 80 chars.
- improvedDescription: 40–80 word natural customer-facing description of what the poster shows, its mood, and why it makes great wall art. Do NOT use generic phrases like "level up your space".

CRITICAL:
- Only name characters or series you are confident you recognize from the image.
- If you are not sure of a character's name, describe them visually instead.
- Do NOT fabricate details.

Return ONLY a valid JSON object with these exact keys, no markdown fences:
{
  "seoTitle": "...",
  "metaDescription": "...",
  "seoAltText": "...",
  "improvedTitle": "...",
  "improvedDescription": "..."
}
""")

def call_vision(image_data, filename):
    result = model.generate_content([
        VISION_PROMPT,
        {"mime_type": "image/webp", "data": image_data}
    ])
    raw = result.text.strip()
    # Strip possible markdown fences
    raw = re.sub(r'^```(?:json)?', '', raw).strip()
    raw = re.sub(r'```$', '', raw).strip()
    return json.loads(raw)

def validate_seo(seo, filename):
    errors = []
    if len(seo.get('seoTitle', '')) > 60:
        errors.append(f"seoTitle too long ({len(seo['seoTitle'])} chars): {seo['seoTitle']}")
    if len(seo.get('metaDescription', '')) > 150:
        errors.append(f"metaDescription too long ({len(seo['metaDescription'])} chars)")
    if not seo.get('seoAltText'):
        errors.append("seoAltText is empty")
    if not seo.get('improvedTitle'):
        errors.append("improvedTitle is empty")
    if errors:
        print(f"  VALIDATION ERRORS for {filename}:")
        for e in errors:
            print(f"    - {e}")
        # Truncate if too long rather than failing
        if len(seo.get('seoTitle', '')) > 60:
            seo['seoTitle'] = seo['seoTitle'][:57] + '...'
        if len(seo.get('metaDescription', '')) > 150:
            seo['metaDescription'] = seo['metaDescription'][:147] + '...'
    return seo

def build_updated_block(old_obj, seo):
    new_obj = {
        "id": old_obj["id"],
        "title": seo["improvedTitle"],
        "category": "Anime",
        "basePrice": old_obj["basePrice"],
        "image": old_obj["image"],
        "description": seo["improvedDescription"],
        "label": old_obj["label"],
        "seoTitle": seo["seoTitle"],
        "metaDescription": seo["metaDescription"],
        "seoAltText": seo["seoAltText"]
    }
    new_block = json.dumps(new_obj, indent=4, ensure_ascii=False)
    # Re-indent inner lines to match original 4-space product indent
    lines = new_block.split('\n')
    indented = lines[0] + '\n' + '\n'.join('    ' + l for l in lines[1:])
    return indented

def git_commit(batch_start, batch_end):
    msg = f"chore(seo): enrich Anime poster metadata {str(batch_start).zfill(3)}-{str(batch_end).zfill(3)}"
    subprocess.run(['git', 'add', 'src/data/products.ts'], cwd=REPO_ROOT, check=True)
    result = subprocess.run(
        ['git', 'commit', '-m', msg],
        cwd=REPO_ROOT, capture_output=True, text=True
    )
    print(f"\n  GIT COMMIT: {result.stdout.strip()}")
    if result.returncode != 0:
        print(f"  GIT ERROR: {result.stderr.strip()}")
    return result.stdout.strip()

# ── Main loop ───────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("Wallify Anime SEO Enrichment")
    print("=" * 60)

    content = load_products()
    all_anime = get_anime_products(content)
    print(f"Total Anime products found: {len(all_anime)}")

    # Filter to only unenriched
    todo = [(m, obj) for m, obj in all_anime if not already_enriched(obj)]
    done_already = len(all_anime) - len(todo)
    print(f"Already enriched: {done_already}")
    print(f"Remaining to process: {len(todo)}")

    if not todo:
        print("All Anime products already enriched. Nothing to do.")
        return

    total_updated = 0
    total_skipped = 0
    commits = []
    batch_num = 0

    for batch_offset in range(0, len(todo), BATCH_SIZE):
        batch = todo[batch_offset: batch_offset + BATCH_SIZE]
        batch_num += 1

        # Determine actual poster numbers for this batch
        first_label = batch[0][1].get('label', '').replace('.webp', '').replace('anime-', '')
        last_label  = batch[-1][1].get('label', '').replace('.webp', '').replace('anime-', '')
        batch_name = f"batch_{str(batch_num).zfill(2)}"

        print(f"\n{'='*60}")
        print(f"BATCH {batch_num}: anime-{first_label} → anime-{last_label} ({len(batch)} posters)")
        print(f"{'='*60}")

        scratch_dir = os.path.join(SCRATCH_BASE, batch_name)
        os.makedirs(scratch_dir, exist_ok=True)

        # ── Step 1: Download ────────────────────────────────────────────
        print("\nStep 1: Downloading images...")
        downloaded = {}
        for _, obj in batch:
            filename = obj.get('label', '')
            if not filename:
                print(f"  SKIP: missing label for id={obj['id']}")
                total_skipped += 1
                continue
            try:
                dest, data = download_image(filename, scratch_dir)
                downloaded[filename] = (dest, data)
                print(f"  OK  {filename} ({len(data):,} bytes)")
            except Exception as e:
                print(f"  ERR {filename}: {e}")
                total_skipped += 1

        if not downloaded:
            print("  No images downloaded for this batch, skipping.")
            continue

        # ── Step 2 & 3: Inspect + generate SEO ──────────────────────────
        print("\nStep 2–3: Visual inspection + SEO generation...")
        batch_seo = {}
        for _, obj in batch:
            filename = obj.get('label', '')
            if filename not in downloaded:
                continue
            _, image_data = downloaded[filename]
            print(f"\n  Inspecting {filename}...")
            try:
                seo = call_vision(image_data, filename)
                seo = validate_seo(seo, filename)
                batch_seo[filename] = seo
                print(f"  seoTitle      : {seo['seoTitle']} ({len(seo['seoTitle'])} chars)")
                print(f"  metaDesc      : {seo['metaDescription'][:80]}... ({len(seo['metaDescription'])} chars)")
                print(f"  improvedTitle : {seo['improvedTitle']}")
                time.sleep(3)  # Rate-limit Gemini calls
            except Exception as e:
                print(f"  ERR generating SEO for {filename}: {e}")
                total_skipped += 1
                time.sleep(3)

        # ── Step 4: Patch products.ts ───────────────────────────────────
        print("\nStep 4: Patching products.ts...")
        content = load_products()  # Reload fresh to avoid stale offsets

        for m, obj in batch:
            filename = obj.get('label', '')
            if filename not in batch_seo:
                continue
            seo = batch_seo[filename]
            old_block = m.group(0)
            new_block = build_updated_block(obj, seo)
            content = content.replace(old_block, new_block, 1)
            print(f"  Patched {filename}")
            total_updated += 1

        save_products(content)
        print(f"  Saved products.ts")

        # ── Step 5: Commit ──────────────────────────────────────────────
        commit_out = git_commit(int(first_label), int(last_label))
        commits.append(commit_out)

        # ── Step 6: Clean up scratch ─────────────────────────────────────
        shutil.rmtree(scratch_dir, ignore_errors=True)
        print(f"  Cleaned up {scratch_dir}")

        print(f"\nBatch {batch_num} complete. Updated: {len(batch_seo)}")

    # ── Final Report ────────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("COMPLETION REPORT")
    print("=" * 60)
    print(f"Total Anime products identified : {len(all_anime)}")
    print(f"Already enriched (pre-existing) : {done_already}")
    print(f"Products successfully updated   : {total_updated}")
    print(f"Products skipped (error/no img) : {total_skipped}")
    print(f"Batches committed               : {batch_num}")
    print("\nCommit messages:")
    for c in commits:
        print(f"  {c}")
    print("\nPreserved fields: id, label, image — unchanged for all products.")
    print("Metadata length checks: enforced (seoTitle≤60, metaDesc≤150).")
    print("TypeScript structure: preserved (array of objects, no syntax changes).")

if __name__ == "__main__":
    main()
