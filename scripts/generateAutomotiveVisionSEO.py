import os
import re
import json
import urllib.request
import time
import google.generativeai as genai

# Setup Gemini
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No GEMINI_API_KEY found")
    exit(1)
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-flash-latest')

products_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'products.ts')
with open(products_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all Automotive objects in the file
pattern = re.compile(r'\{\s*"id":\s*"p\d+",\s*"title":\s*"Automotive \d+(?:[^"]*)",\s*"category":\s*"Automotive",\s*"basePrice":\s*\d+,\s*"image":\s*"/assets/automotive/(automotive-\d+\.webp)",\s*"description":\s*"[^"]*",\s*"label":\s*"[^"]*"(?:\s*,\s*"seoTitle":\s*"[^"]*")?(?:\s*,\s*"metaDescription":\s*"[^"]*")?(?:\s*,\s*"seoAltText":\s*"[^"]*")?\s*\}')

matches = list(pattern.finditer(content))
print(f"Found {len(matches)} automotive posters total.")

count = 0
for match in matches:
    block = match.group(0)
    image_filename = match.group(1) # e.g. automotive-019.webp
    image_num = image_filename.replace('automotive-', '').replace('.webp', '')
    
    if '"seoTitle"' in block:
        continue # Already processed
    
    print(f"Analyzing {image_filename}...")
    image_url = f"https://res.cloudinary.com/dkwx4bacj/image/upload/v1/wallify/assets/automotive/{image_filename}"
    
    try:
        # Download image
        req = urllib.request.Request(image_url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        image_data = response.read()
        
        prompt = """
        You are an expert e-commerce SEO copywriter. Look at this car poster.
        Generate a JSON object with the following exact keys for this poster:
        {
            "seoTitle": "A catchy, keyword-rich SEO title (max 60 chars) describing the car and style",
            "metaDescription": "A high-converting description (max 150 chars) describing the car and mood",
            "seoAltText": "A precise, descriptive alt text for visually impaired users and SEO describing the exact car, angle, and background"
        }
        ONLY output valid JSON, nothing else.
        """
        
        result = model.generate_content([
            prompt,
            {
                "mime_type": "image/webp",
                "data": image_data
            }
        ])
        
        text = result.text.strip().replace('```json', '').replace('```', '').strip()
        seo_data = json.loads(text)
        
        old_obj = json.loads(block)
        
        new_obj = {
            "id": old_obj["id"],
            "title": f"Automotive {image_num}",
            "category": "Automotive",
            "basePrice": old_obj["basePrice"],
            "image": old_obj["image"],
            "description": seo_data["metaDescription"],
            "label": old_obj["label"],
            "seoTitle": seo_data["seoTitle"],
            "metaDescription": seo_data["metaDescription"],
            "seoAltText": seo_data["seoAltText"]
        }
        
        new_block = json.dumps(new_obj, indent=4)
        lines = new_block.split('\n')
        new_block_indented = lines[0] + '\n' + '\n'.join('    ' + line for line in lines[1:])
        
        content = content.replace(block, new_block_indented)
        print(f"Updated {image_filename}: {seo_data['seoTitle']}")
        
        count += 1
        
        if count % 5 == 0:
            with open(products_path, 'w', encoding='utf-8') as f:
                f.write(content)
                
        time.sleep(4.2)
        
    except Exception as e:
        print(f"Error on {image_filename}: {e}")
        time.sleep(4.2)

with open(products_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Finished updating {count} posters!")
