import os
from slugify import slugify
from PIL import Image
import pytesseract

folder = "."

def extract_text(image_path):
    try:
        text = pytesseract.image_to_string(Image.open(image_path))
        return text.strip()
    except:
        return ""

def generate_name(filename, text):
    base = os.path.splitext(filename)[0]

    # fallback if no text
    if len(text) < 5:
        text = base

    # keep it short + SEO friendly
    text = text.lower().replace("\n", " ")
    words = text.split()[:6]  # limit words

    return slugify(" ".join(words))

for file in os.listdir(folder):
    if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        old_path = os.path.join(folder, file)

        text = extract_text(old_path)
        new_name = generate_name(file, text)

        ext = os.path.splitext(file)[1]
        new_file = new_name + ext
        new_path = os.path.join(folder, new_file)

        # avoid overwrite
        count = 1
        while os.path.exists(new_path):
            new_file = f"{new_name}-{count}{ext}"
            new_path = os.path.join(folder, new_file)
            count += 1

        os.rename(old_path, new_path)
        print(f"{file} → {new_file}")
