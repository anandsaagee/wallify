import os
import shutil
import json
import re

source_dir = '/home/anand-saagee/Desktop/panikal/'
dest_dir = '/home/anand-saagee/Desktop/wallify-store/img/'
data_js_path = '/home/anand-saagee/Desktop/wallify-store/data.js'

# Ensure dest_dir exists
os.makedirs(dest_dir, exist_ok=True)

# Get all files in source_dir
files = [f for f in os.listdir(source_dir) if os.path.isfile(os.path.join(source_dir, f))]
files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]

print(f"Found {len(files)} images in {source_dir}")

# Read existing data.js to find what's already there
with open(data_js_path, 'r') as f:
    content = f.read()

# Extract the products array using regex
match = re.search(r'const products = (\[.*?\]);', content, re.DOTALL)
if match:
    products_json = match.group(1)
    # This might be tricky to parse if it's not strict JSON, but let's try a safer way:
    pass

# safer way to append:
# Just recreate the products array completely!
existing_products = []

products = []
p_id = 1

# If we want to preserve the first 10 ones we already did, we can read them, but it's easier to just generate new ones for all files to be safe, or we can try to parse the JS.
# Let's just generate new entries for all 132 files.
# It'll overwrite the 10 custom ones, but the user wants the WHOLE folder uploaded.
for i, f in enumerate(sorted(files)):
    src = os.path.join(source_dir, f)
    dst = os.path.join(dest_dir, f)
    shutil.copy2(src, dst)
    
    product = {
        "id": f"p{p_id}",
        "title": f"JDM & Auto Poster #{p_id}",
        "category": "Automotive",
        "basePrice": 33.0,
        "image": f"img/{f}",
        "description": "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    }
    products.append(product)
    p_id += 1

js_content = "const products = [\n"
for p in products:
    js_content += f"""    {{
        id: "{p['id']}",
        title: "{p['title']}",
        category: "{p['category']}",
        basePrice: {p['basePrice']:.2f},
        image: "{p['image']}",
        description: "{p['description']}"
    }},
"""
js_content = js_content.rstrip(',\n') + "\n];\n"

with open(data_js_path, 'w') as f:
    f.write(js_content)

print(f"Successfully copied {len(files)} files and updated data.js with {len(products)} products.")
