import os
import json
import urllib.parse

def generate_db():
    # Define category to folder mapping
    # Note: Folder names are case-sensitive on Linux. 
    # Checking for common variations to be safe.
    folder_map = {
        "Automotive": ["assets/AM/", "assets/am/"],
        "Mollywood": ["assets/Mollywood/"],
        "Aesthetic": ["assets/aesthe/"],
        "Anime": ["assets/anime/"],
        "Football": ["assets/football/"],
        "Classic Cars": ["assets/classic-cars/"]
    }

    allowed_exts = {'.jpg', '.jpeg', '.png', '.webp'}
    products = []
    
    global_id = 1

    print("--- Wallify Build: Generating Product Database ---")

    for cat_name, folders in folder_map.items():
        # Find the first existing folder for this category
        folder_path = None
        for f in folders:
            if os.path.isdir(f):
                folder_path = f
                break
        
        if not folder_path:
            print(f"! Warning: No directory found for {cat_name} (checked {folders})")
            continue
        
        # Scan files
        files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
        
        # Filter files: exclude hidden files and anything containing 'trashed'
        valid_files = []
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in allowed_exts:
                if not f.startswith('.') and 'trashed' not in f.lower():
                    valid_files.append(f)
                    
        valid_files.sort() # Ensure consistent order

        print(f"-> Category: {cat_name} | Found {len(valid_files)} images in {folder_path}")
        
        for idx, filename in enumerate(valid_files, start=1):
            title = f"{idx} - {filename}"
            img_path = os.path.join(folder_path, filename).replace('\\', '/')
            
            # Encode URI for safe browser usage
            parts = img_path.split('/')
            safe_img_path = '/'.join([urllib.parse.quote(p) for p in parts])
            
            products.append({
                "id": f"p{global_id}",
                "title": title,
                "category": cat_name,
                "basePrice": 33.00,
                "image": safe_img_path,
                "description": f"Premium {cat_name} wall art. {title}",
                "label": title
            })
            global_id += 1

    js_content = "const products = " + json.dumps(products, indent=4) + ";\n"
    
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"\nSUCCESS: Generated data.js with {len(products)} total products.")

if __name__ == "__main__":
    generate_db()
