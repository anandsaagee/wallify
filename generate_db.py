import os
import json
import urllib.parse

def generate_db():
    categories = {
        "Mollywood": "assets/Mollywood/",
        "Aesthetic": "assets/aesthe/",
        "Anime": "assets/anime/",
        "Football": "assets/football/",
        "Classic Cars": "assets/classic-cars/",
        "Automotive": "assets/AM/"
    }

    allowed_exts = {'.jpg', '.jpeg', '.png', '.webp'}
    products = []
    
    # Track the global product id index
    global_id = 1

    for cat_name, folder_path in categories.items():
        if not os.path.isdir(folder_path):
            print(f"Directory {folder_path} does not exist, skipping...")
            continue
        
        # Get all valid image files
        files = []
        for f in os.listdir(folder_path):
            if os.path.isfile(os.path.join(folder_path, f)):
                ext = os.path.splitext(f)[1].lower()
                if ext in allowed_exts:
                    files.append(f)
                    
        # Sort files to ensure reproducible indices
        files.sort()
        
        for idx, filename in enumerate(files, start=1):
            title = f"{idx} - {filename}"
            
            # Create URL safe image path
            img_path = os.path.join(folder_path, filename).replace('\\', '/')
            # encode URI components just in case of spaces
            parts = img_path.split('/')
            encoded_parts = [urllib.parse.quote(p) for p in parts]
            safe_img_path = '/'.join(encoded_parts)
            
            p = {
                "id": f"p{global_id}",
                "title": title,
                "category": cat_name,
                "basePrice": 33.00,
                "image": safe_img_path,
                "description": f"Premium {cat_name} wall art. {title}",
                "label": title
            }
            products.append(p)
            global_id += 1

    # Output to data.js
    js_content = "const products = " + json.dumps(products, indent=4) + ";\n"
    
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"Successfully generated data.js with {len(products)} products across {len(categories)} categories.")

if __name__ == "__main__":
    generate_db()
