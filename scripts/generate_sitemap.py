import os
import re

base_url = 'https://wallifystore.in'
products_file = 'src/data/products.ts'
sitemap_file = 'public/sitemap.xml'
robots_file = 'public/robots.txt'

with open(products_file, 'r', encoding='utf-8') as f:
    content = f.read()

products = []
matches = re.findall(r'"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)"', content)
for title, category in matches:
    products.append({'title': title, 'category': category})

categories = sorted(list(set(p['category'] for p in products)))

xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>{base_url}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>"""

for cat in categories:
    xml += f"""
  <url>
    <loc>{base_url}/category/{cat.lower()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>"""

for p in products:
    slug = re.sub(r'[^a-z0-9]+', '-', p['title'].lower()).strip('-')
    cat_slug = p['category'].lower()
    xml += f"""
  <url>
    <loc>{base_url}/posters/{cat_slug}/{slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>"""

xml += '\n</urlset>'

os.makedirs('public', exist_ok=True)
with open(sitemap_file, 'w', encoding='utf-8') as f:
    f.write(xml)

robots = f"""User-agent: *
Allow: /

Sitemap: {base_url}/sitemap.xml
"""
with open(robots_file, 'w', encoding='utf-8') as f:
    f.write(robots)

print(f"Generated {sitemap_file} ({len(products)} products, {len(categories)} categories) and {robots_file}.")
