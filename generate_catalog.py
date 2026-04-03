import os
import json

CATEGORIES = [
    {"name": "Mollywood", "path": "assets/Mollywood", "category": "Mollywood"},
    {"name": "Aesthetic", "path": "assets/aesthe", "category": "Aesthetic"},
    {"name": "Anime", "path": "assets/anime", "category": "Anime"},
    {"name": "Football", "path": "assets/football", "category": "Football"},
    {"name": "Classic Cars", "path": "assets/classic-cars", "category": "Classic Cars"}
]

DATA_JS_PATH = 'data.js'
ALLOWED_EXT = ('.jpg', '.png', '.webp', '.jpeg')

def build_data():
    products = []
    global_index = 1
    
    for cat_info in CATEGORIES:
        folder_path = cat_info["path"]
        category_name = cat_info["category"]
        
        if not os.path.exists(folder_path):
            print(f"Warning: Directory {folder_path} not found. Skipping.")
            continue
            
        files = [f for f in os.listdir(folder_path) if f.casefold().endswith(ALLOWED_EXT)]
        # Sort files to ensure stable order
        files.sort()
        
        for f in files:
            # Recreate product data structure required by JS
            # Requirements: "Display Format: <index number> - <exact file name>" -> Display format means Title
            # e.g., "1 - kgf.jpg"
            title = f"{global_index} - {f}"
            
            product = {
                "id": f"p{global_index}",
                "title": title,
                "category": category_name,
                "basePrice": 33.0, # Default based on previous logic
                "image": f"{folder_path}/{f}",
                "description": f"Premium {category_name} wall art. {title}"
            }
            products.append(product)
            global_index += 1
            
    # Generate data.js format
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
    # Remove trailing comma and newline from last object
    js_content = js_content.rstrip(',\n') + "\n];\n"
    
    with open(DATA_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"Successfully generated data.js with {len(products)} auto-detected images!")

if __name__ == '__main__':
    build_data()
